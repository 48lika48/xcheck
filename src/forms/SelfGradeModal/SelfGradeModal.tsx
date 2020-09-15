import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import SelfGradeContainer from './SelfGradeContainer';

export interface Iprops {
  taskId?: string
}

export const SelfGradeModal: React.FC<Iprops> = (props:Iprops) => {

  const [showModal, setShowModal] = useState(false);

  const cancelChanges = (): void => {
    setShowModal(false);
  }

  const saveChanges = (): void => {
    message.success('Self-Grade saved!');
    setShowModal(false);
  }

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setShowModal(true);
        }}
      >
        Do Self-Check
      </Button>
      <Modal
        title="Self-Check"
        centered
        visible={showModal}
        okText='Save result'
        onOk={() => { saveChanges() }}
        onCancel={() => cancelChanges()}
        width={1000}
      >
        <SelfGradeContainer taskId={props.taskId}/>
      </Modal>
    </div >
  )
}