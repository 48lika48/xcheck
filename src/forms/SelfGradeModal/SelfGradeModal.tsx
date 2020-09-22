import React, { useState } from 'react';
import { Modal, message } from 'antd';
import { SelfGradeForm } from './SelfGradeForm';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { setSelfGrade } from 'src/store/reducers/reviewRequestSlice';
const WARNING_MESSAGE = 'Check carefully! Enter and save all items.';

type SelfGradeModalProps = {
  taskId: string | null;
  isSelfGradeShow: boolean;
  selfGradeHandler: () => void;
}

export const SelfGradeModal: React.FC<SelfGradeModalProps> = ({ taskId, selfGradeHandler, isSelfGradeShow }) => {
  const [showModal, setShowModal] = useState(isSelfGradeShow);
  const [isDisabledButton, setIsDisabledButton] = useState(true);

  const dispatch = useDispatch();
  const { task } = useSelector((state: RootState) => state.selfGradeSlice);
  const { taskScore } = useSelector((state: RootState) => state.selfGradeSlice);

  const cancelChanges = (): void => {
    setShowModal(false);
    setIsDisabledButton(true);
    selfGradeHandler();
  };

  const saveChanges = (): void => {
    setShowModal(false);
    selfGradeHandler();
  };

  const handleEndCheck = (): void => {
    if (task?.items && taskScore.items.length !== task?.items.length) {
      message.warning(WARNING_MESSAGE);
      return;
    }
    dispatch(setSelfGrade(taskScore));
    setIsDisabledButton(false);
    message.success('Check Saved!');
  };

  return (
    <div>
      <Modal
        title="Check task"
        centered
        visible={showModal}
        okText="OK"
        onOk={saveChanges}
        onCancel={cancelChanges}
        okButtonProps={{ disabled: isDisabledButton }}
        width={900}
      >
        <SelfGradeForm taskId={taskId} handleEndCheck={handleEndCheck} />
      </Modal>
    </div>
  );
};
