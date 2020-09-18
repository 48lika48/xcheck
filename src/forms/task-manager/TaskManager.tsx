import React, { useState } from 'react';
import moment from 'moment';
import Main from './Steps/Main';
import Basic from './Steps/Basic';
import Advanced from './Steps/Advanced';
import Extra from './Steps/Extra';
import Fines from './Steps/Fines';
import { Form, Modal, Button, Steps, message, Space, Upload } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { saveTask } from 'src/services/save-task';
import { parsTask } from 'src/services/parser-task';
import { ITask, TaskState } from 'src/models';
const { Step } = Steps;

const task: ITask = {
  id: '',
  description: '',
  startDate: moment().format(),
  endDate: moment().format(),
  goals: [],
  requirements: [],
  subtasks: [{ basic: [] }, { advanced: [] }, { extra: [] }, { fines: [] }],
  score: [{ basic: [] }, { advanced: [] }, { extra: [] }, { fines: [] }],
  maxScore: 0,
  author: '',
  state: TaskState.DRAFT,
  categoriesOrder: [],
  items: [],
}

export const TaskManager: React.FC = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const [taskData, setTaskData] = useState(task);
  const [fileList, setFileList] = React.useState([{ uid: null }]);

  const onDataChange = (field: string, value: any) => {
    if (field === 'allData') { return setTaskData(value) }
    setTaskData((task) => { return { ...task, [field]: value } })
  }

  const showMessage = (isUploaded: boolean) => {
    isUploaded
      ? message.success(`file uploaded successfully.`)
      : message.error(`file upload failed.`);
  }

  const load: any = {
    name: 'file',
    accept: '.json, .md',
    customRequest: (options: { file: File; }) => {
      setTaskData(task);
      parsTask({ file: options.file, taskData, setTaskData: onDataChange, showMessage })
    },
    fileList,
    showUploadList: false,
    onChange: async (info: { file: { uid: null; }; }) => setFileList([info.file]),
  };


  const steps = [
    {
      title: 'Main',
      content: <Main onDataChange={onDataChange} taskData={taskData} />
    },
    {
      title: 'Basic Scope',
      content: <Basic onDataChange={onDataChange} taskData={taskData} />,
    },
    {
      title: 'Advanced scope',
      content: <Advanced onDataChange={onDataChange} taskData={taskData} />,
    },
    {
      title: 'Extra scope',
      content: <Extra onDataChange={onDataChange} taskData={taskData} />,
    },
    {
      title: 'Fines',
      content: <Fines onDataChange={onDataChange} taskData={taskData} />,
    }
  ];

  const showManager = (): void => {
    setIsShowModal(true);
  }

  const closeManager = (): void => {
    setIsShowModal(false);
  }

  const next = (): void => {
    setStep(step + 1);
  }

  const prev = (): void => {
    setStep(step - 1);

  }

  const createTask = (): void => {
    message.success('Task created!');
    setStep(0);
    setIsShowModal(false);
  }

  const saveChanges = (): void => {
    message.success('Changes saved!');
    setStep(0);
    setIsShowModal(false);
  }

  return (
    <>
      <Button type="primary" onClick={showManager}>
        Create task +
      </Button>
      <Modal
        title="Create task"
        width={1000}
        visible={isShowModal}
        okText="Save"
        onOk={saveChanges}
        onCancel={closeManager}
        okButtonProps={{ disabled: false }}
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
              <Button type="primary" onClick={createTask}>
                Done
              </Button>
            )}
          </div>
          <Form.Item>
            <Space>
              <Upload {...load}>
                <Button icon={<UploadOutlined />}>Import data</Button>
              </Upload>
              <Button icon={<DownloadOutlined />} onClick={() => saveTask(taskData)}>Export data</Button>
            </Space>
          </Form.Item>
        </div>
      </Modal>
    </>
  );
}
