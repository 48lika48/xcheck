import React from 'react';
import { Modal } from 'antd';

interface ICrossSessionForm {
  isShowModal: boolean;
}
const saveChanges = () => {};
const closeManager = () => {};

export const CrossSessionCreate = (props: ICrossSessionForm) => {
  const { isShowModal } = props;
  return (
    <Modal
      title="Create cross check session"
      width={1000}
      visible={isShowModal}
      okText="Save"
      onOk={saveChanges}
      onCancel={closeManager}
      okButtonProps={{ disabled: false }}
      cancelButtonProps={{ disabled: false }}
    >
      SomeHere
    </Modal>
  );
};
