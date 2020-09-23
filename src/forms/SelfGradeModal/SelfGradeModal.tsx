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
  const [isDisabledButton, setIsDisabledButton] = useState(true);
  const dispatch = useDispatch();
  const { taskScore } = useSelector((state: RootState) => state.selfGradeSlice);

  const cancelChanges = (): void => {
    setIsDisabledButton(true);
    selfGradeHandler();
  };

  const saveChanges = (): void => {
    selfGradeHandler();
  };

  const handleEndCheck = (): void => {
    if (!taskScore.items.length) {
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
        visible={isSelfGradeShow}
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
