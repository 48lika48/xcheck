import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { SelfGradeForm } from './SelfGradeForm';

export type Iprops = {
	taskId?: string;
	handleConfirmClick: () => void;
};

export const SelfGradeModal: React.FC<{ taskId: string }> = (props: any) => {
	const [ showModal, setShowModal ] = useState(false);
	const [ isDisabledButton, setIsDisabledButton ] = useState(true);

	const cancelChanges = (): void => {
		setShowModal(false);
		setIsDisabledButton(true);
	};

	const saveChanges = (): void => {
		setShowModal(false);
		message.success('Self-Check saved!');
	};

	const handleConfirmClick = (): void => {
		setIsDisabledButton(false);
		message.success('Confirmed!');
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
				title="Self-Check"
				centered
				visible={showModal}
				okText="Save result"
				onOk={() => {
					saveChanges();
				}}
				onCancel={() => cancelChanges()}
				okButtonProps={{ disabled: isDisabledButton }}
				width={900}
			>
				<SelfGradeForm taskId={props.taskId} handleConfirmClick={handleConfirmClick} />
			</Modal>
		</div>
	);
};
