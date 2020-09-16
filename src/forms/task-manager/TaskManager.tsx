import React, { useState } from 'react';
import Main from './Steps/Main';
import Basic from './Steps/Basic';
import Advanced from './Steps/Advanced';
import Extra from './Steps/Extra';
import Fines from './Steps/Fines';
import { Modal, Button, Steps, message } from 'antd';
import moment from 'moment';
const { Step } = Steps;

const task = {
  id: '',
  description: '',
  startDate: moment(),
  endDate: moment(),
  goals: [],
  requirements: [],
  subtasks: [{basic: []}, {advanced: []}, {extra: []}, {fines: []}],
  score: [{basic: []}, {advanced: []}, {extra: []}, {fines: []}],
  maxScore: 0,
  screenshot: {},
  author: '',
  state: '',
  categoriesOrder: [],
  items: [],
}

export const TaskManager: React.FC = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const [taskData, setTaskData] = useState(task);

  const onDataChange = (field: string, value: any) => {
    setTaskData((task) => {
      return { ...task, [field]: value }
    })
    console.log(taskData)
  }

  const steps = [
    {
      title: 'Main',
      content: <Main onDataChange={onDataChange} taskData={taskData} />
    },
    {
      title: 'Basic Scope',
      content: <Basic onDataChange={onDataChange} taskData={taskData}/>,
    },
    {
      title: 'Advanced scope',
      content: <Advanced onDataChange={onDataChange} taskData={taskData}/>,
    },
    {
      title: 'Extra scope',
      content: <Extra onDataChange={onDataChange} taskData={taskData}/>,
    },
    {
      title: 'Fines',
      content: <Fines onDataChange={onDataChange} taskData={taskData}/>,
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
          {step > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Previous
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
}
