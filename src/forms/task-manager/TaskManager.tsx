import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

import { Form, Modal, Button, Steps, Space, Upload, message } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { saveTask } from 'src/services/save-task';
import { parsTask } from 'src/services/parser-task';
import { ITask, TaskState, UserRole } from '../../models';
import { fetchNewTask, fetchTasks, fetchUpdateTask, finishEditingTask } from 'src/store/reducers/tasksSlice';
import { RootState } from 'src/store/rootReducer';
import CreateTaskStep from './CreateTaskStep';
import MainStep from './MainStep';
const { Step } = Steps;

export const defaultSubtask = { basic: [], advanced: [], extra: [], fines: [] };
export const defaultScore = { basic: [0], advanced: [0], extra: [0], fines: [0] };

const defaultTask: ITask = {
  id: '',
  description: '',
  startDate: moment().format(),
  endDate: moment().format(),
  goals: [],
  requirements: [],
  subtasks: defaultSubtask,
  score: defaultScore,
  maxScore: 0,
  author: '',
  state: TaskState.DRAFT,
  categoriesOrder: [],
  items: [],
}

export const TaskManager: React.FC = () => {
  const dispatch = useDispatch();
  const [isShowModal, setIsShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const [taskData, setTaskData] = useState(defaultTask);
  const [fileList, setFileList] = React.useState([{ uid: null }]);
  const { userData, currentRole } = useSelector((state: RootState) => state.users.currentUser);
  const { activeTaskId, allTasks } = useSelector((state: RootState) => state.tasks);
  const { githubId } = userData;

  const isDisabled = currentRole === UserRole.student;

  useEffect(() => {
    dispatch(fetchTasks());
    onDataChange('author', githubId);
  }, [githubId, dispatch]);

  useEffect(() => {
    if (activeTaskId) {
      showManager();
      const task = { ...allTasks.filter((item: ITask) => item.id === activeTaskId)[0] };
      task.subtasks = task.subtasks && { ...task.subtasks };
      task.score = task.score && { ...task.score };
      setTaskData(task);
    }
  }, [allTasks, activeTaskId])

  const onDataChange = (field: string, value: any) => {
    if (field === 'allData') { return setTaskData(value) }
    setTaskData((task) => { return { ...task, [field]: value } })
  }

  const load: any = {
    name: 'file',
    accept: '.json, .md',
    customRequest: (options: { file: File; }) => {
      setTaskData(defaultTask);
      onDataChange('author', githubId);
      parsTask({ file: options.file, taskData, setTaskData: onDataChange });
    },
    fileList,
    showUploadList: false,
    onChange: async (info: { file: { uid: null; }; }) => setFileList([info.file]),
  };

  const steps = [
    {
      title: "Main",
      content: <MainStep onDataChange={onDataChange} taskData={taskData} />
    },
    {
      title: 'Basic Scope',
      content: <CreateTaskStep stepId="basic" onDataChange={onDataChange} taskData={taskData} />,
    },
    {
      title: 'Advanced scope',
      content: <CreateTaskStep stepId="advanced" onDataChange={onDataChange} taskData={taskData} />,
    },
    {
      title: 'Extra scope',
      content: <CreateTaskStep stepId="extra" onDataChange={onDataChange} taskData={taskData} />,
    },
    {
      title: 'Fines',
      content: <CreateTaskStep stepId="fines" onDataChange={onDataChange} taskData={taskData} />,
    }
  ];

  const showManager = (): void => {
    setStep(0);
    setIsShowModal(true);
  }

  const closeManager = (): void => {
    setIsShowModal(false);
    dispatch(finishEditingTask());
  }

  const next = (): void => {
    setStep(step + 1);
  }

  const prev = (): void => {
    setStep(step - 1);
  }

  const createTask = (): void => {
    saveChanges();
    setIsShowModal(false);
    setTaskData(defaultTask);
    setStep(0);
  }

  const saveChanges = (): void => {
    if (activeTaskId) {
      dispatch(fetchUpdateTask(activeTaskId, taskData));
      message.success('Changes saved!')
    } else {
      dispatch(fetchNewTask(taskData));
      message.success('Task created!');
    }
  }

  return (
    <>
      {currentRole !== UserRole.student && <Button type="primary" onClick={showManager}>
        Create task +
      </Button>}
      <Modal
        title="Create task"
        width={1000}
        visible={isShowModal}
        okText="Save"
        onOk={saveChanges}
        onCancel={closeManager}
        okButtonProps={{ disabled: isDisabled }}
        cancelButtonProps={{ disabled: false }}
      >
        <Steps current={step} style={{ margin: '20px 0px' }}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[step].content}</div>
        <div className="steps-action">
          <div className="steps-action-btns">
            {step > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                Previous
              </Button>
            )}
            {step < steps.length - 1 && (
              <Button type="primary" htmlType="submit" onClick={() => next()}>
                Next
              </Button>
            )}
            {step === steps.length - 1 && (

              <Button type="primary" onClick={createTask} hidden={isDisabled}>
                Done
              </Button>
            )}
          </div>
          <Form.Item>
            <Space>
              <Upload {...load}>
                <Button icon={<UploadOutlined />} hidden={isDisabled}>Import data</Button>
              </Upload>
              <Button icon={<DownloadOutlined />} onClick={() => saveTask(taskData)}>Export data</Button>
            </Space>
          </Form.Item>
        </div>
      </Modal>
    </>
  );
}
