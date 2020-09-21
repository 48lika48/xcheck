import React from 'react';
import { Modal } from 'antd';
import { CrossSessionForm } from './components/crossSessionForm';
import { ITask } from '../../models';

interface ICrossSessionForm {
  isShowModal: boolean;
}
const saveChanges = () => {};
const closeManager = () => {};
const tasks: ITask[] = [];

export const CrossSessionCreate = (props: ICrossSessionForm) => {
  const { isShowModal } = props;
  return (
    <Modal title="Create cross check session" width={1000} visible={isShowModal} footer={null}>
      <CrossSessionForm id={'crossSessionForm'} tasks={tasks} />
    </Modal>
  );
};
