import React from 'react';
import { Modal } from 'antd';
import { CrossSessionForm } from './components/crossSessionForm';
import { ICheckSession, ITask } from '../../models';

interface ICrossSessionForm {
  isShowModal: boolean;
  closeManager: () => void;
  tasks: ITask[];
  isEdit: boolean;
  editData: any;
  onSave: (data: ICheckSession) => void;
}

export const CrossSessionCreate = (props: ICrossSessionForm) => {
  const { isShowModal, closeManager, tasks, isEdit, editData, onSave } = props;
  return (
    <Modal
      title={isEdit ? 'Edit cross check session' : 'Create new cross check session'}
      width={1000}
      visible={isShowModal}
      footer={null}
      destroyOnClose={true}
      onCancel={() => closeManager()}
    >
      <CrossSessionForm
        id={'crossSessionForm'}
        tasks={tasks}
        isEdit={isEdit}
        editData={editData}
        onSave={onSave}
        onCancel={closeManager}
      />
    </Modal>
  );
};
