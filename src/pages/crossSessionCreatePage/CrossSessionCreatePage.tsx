import React from 'react';
import { Modal } from 'antd';
import { CrossSessionForm } from './components/crossSessionForm';
import { ITask } from '../../models';

interface ICrossSessionForm {
  isShowModal: boolean;
  closeManager: () => void;
  tasks: ITask[];
  isEdit: boolean;
  editData: any;
}

export const CrossSessionCreate = (props: ICrossSessionForm) => {
  const { isShowModal, closeManager, tasks, isEdit } = props;
  const saveChanges = () => {};
  return (
    <Modal
      title="Create cross check session"
      width={1000}
      visible={isShowModal}
      footer={null}
      destroyOnClose={true}
      onCancel={() => closeManager()}
    >
      <CrossSessionForm id={'crossSessionForm'} tasks={tasks} isEdit={isEdit} />
    </Modal>
  );
};
