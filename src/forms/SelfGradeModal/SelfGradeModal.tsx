import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { SelfGradeForm } from './SelfGradeForm';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { setSelfGrade } from 'src/store/reducers/reviewRequestSlice';

export type Iprops = {
	taskId?: string;
	handleEndCheck: () => void;
};

export const SelfGradeModal: React.FC<{ taskId: string }> = (props: any) => {
	const [showModal, setShowModal] = useState(false);
	const [isDisabledButton, setIsDisabledButton] = useState(true);

	const dispatch = useDispatch();

	const { taskScore } = useSelector((state: RootState) => state.selfGradeSlice);

	const cancelChanges = (): void => {
		setShowModal(false);
		setIsDisabledButton(true);
	};

	const saveChanges = (): void => {
		setShowModal(false);
	};

	const handleEndCheck = (): void => {
		if (!taskScore.items.length) {
			message.warning('Check carefully! Enter and save all items.');
			return;
		}
		dispatch(setSelfGrade(taskScore));
		setIsDisabledButton(false);
		message.success('Check Saved!');
	};

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
				title="Check task"
				centered
				visible={showModal}
				okText="OK"
				onOk={saveChanges}
				onCancel={cancelChanges}
				okButtonProps={{ disabled: isDisabledButton }}
				width={900}
			>
				<SelfGradeForm taskId={props.taskId} handleEndCheck={handleEndCheck} />
			</Modal>
		</div>
	);
};
