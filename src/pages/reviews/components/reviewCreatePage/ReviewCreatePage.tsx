import React from 'react';
import { Modal } from 'antd';
import { ReviewForm } from '../../../../forms/SelfGradeModal/ReviewForm';
import { IReviewRequest, ITask } from '../../../../models';

interface IReviewCreatePage {
  isEdit: boolean;
  isShowModal: boolean;
  closeManager: () => void;
  reviewRequest: IReviewRequest | null;
  task: ITask[] | undefined;
  save: (result: any) => void;
}

export const ReviewCreatePage = (props: IReviewCreatePage) => {
  const { isEdit, isShowModal, closeManager, reviewRequest, task, save } = props;
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
        save={save}
        reviewRequest={reviewRequest}
        task={task?.find((item) => item.id === reviewRequest?.task)}
      />
    </Modal>
  );
};
