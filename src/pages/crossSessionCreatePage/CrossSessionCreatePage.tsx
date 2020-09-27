import React from 'react';
import { Modal } from 'antd';
import { CrossSessionForm } from './components/crossSessionForm';
import { ICheckSession, IReviewRequest, ITask } from '../../models';

interface ICrossSessionForm {
  isShowModal: boolean;
  closeManager: () => void;
  tasks: ITask[];
  isEdit: boolean;
  editData: any;
  onSave: (data: ICheckSession) => void;
  requests: IReviewRequest[];
}

export const CrossSessionCreate = (props: ICrossSessionForm) => {
  const { isShowModal, closeManager, tasks, isEdit, editData, onSave, requests } = props;
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
        requests={requests}
      />
    </Modal>
  );
};
