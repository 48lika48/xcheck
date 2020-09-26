import React, { useState } from 'react';
import { Modal, message } from 'antd';
import { ReviewForm } from '../../../../forms/SelfGradeModal/ReviewForm';
import { IReviewRequest, ITask } from '../../../../models';

interface IReviewCreatePage {
  isEdit: boolean;
  isShowModal: boolean;
  closeManager: () => void;
  reviewRequest: IReviewRequest | null;
  task: ITask[] | undefined;
}

export const ReviewCreatePage = (props: IReviewCreatePage) => {
  const { isEdit, isShowModal, closeManager, reviewRequest, task } = props;
  return (
    <Modal
      title={
        isEdit ? 'Edit review' : `New for ${reviewRequest?.author} - ${reviewRequest?.task} task.`
      }
      width={1000}
      visible={isShowModal}
      footer={null}
      destroyOnClose={true}
      onCancel={() => closeManager()}
    >
      <ReviewForm
        reviewRequest={reviewRequest}
        task={task?.find((item) => item.id === reviewRequest?.task)}
      />
    </Modal>
  );
};
