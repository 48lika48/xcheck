import React, { useState } from 'react';
import Main from './Steps/Main';
import Basic from './Steps/Basic';
import Advanced from './Steps/Advanced';
import Extra from './Steps/Extra';
import Fines from './Steps/Fines';
import { Modal, Button, Steps, message } from 'antd';
const { Step } = Steps;

export const TaskManager: React.FC = (props) => {
  const [modal, showModal ] = useState(false);
  const [current, changeProgress ] = useState(0);

  const steps = [
    { title: 'Main',
      content: <Main />
    },
    {
      title: 'Basic Scope',
      content: <Basic />,
    },
    {
      title: 'Advanced scope',
      content: <Advanced />,
    },
    {
      title: 'Extra scope',
      content: <Extra />,
    },
    {
      title: 'Fines',
      content: <Fines />,
    }
  ];

  const showManager = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    showModal(true);
  }

  const closeManager = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    showModal(false);
  }

  const next = (): void => {
    changeProgress(current + 1);
  }

  const prev = (): void => {
    changeProgress(current - 1);
    
  }

  const createTask = (): void => {
    message.success('Task created!');
    changeProgress(0);
    showModal(false);
  }

  const saveChanges = (): void => {
    message.success('Changes saved!');
    changeProgress(0);
    showModal(false);
  }


  return (
    <>
    <Button type="primary" onClick={showManager}>
      Create task +
    </Button>
    <Modal
        title="Create task"
        width={1000}
        visible={modal}
        okText="Save"
        onOk={saveChanges}
        onCancel={closeManager}
        okButtonProps={{ disabled: false }}
        cancelButtonProps={{ disabled: false }}
      >
      <Steps current={current} style={{ margin: '20px 0px' }}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action">
          {current < steps.length - 1 && (
            <Button type="primary" htmlType="submit" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={createTask}> 
              Done
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Previous
            </Button>
          )}
        </div>
    </Modal>
  </>
  );
}