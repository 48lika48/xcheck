import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/rootReducer';
import { addDisputeData, updateReviewState, deleteDisputeItem } from '../../../../store/reducers/reviewRequestSlice';
import { Modal, Button, Result, message } from 'antd';
import { IDispute, ITaskScore, ITaskScoreItem, DisputeState, IReview, ReviewState } from '../../../../models';
import { DisputeForm } from '../DisputeForm'

type ReviewDetailsProps = {
  data: ITaskScore | null;
  visible: boolean;
  hideDetailsModal: () => void;
  review: IReview | undefined,
}

export const ReviewDetails: React.FC<ReviewDetailsProps> = (props) => {

  const { visible, hideDetailsModal, data, review } = props

  const dispatch = useDispatch();
  const { isLoading, disputes } = useSelector((state: RootState) => state.reviewRequest)

  const handleOk = () => {
    hideDetailsModal()
    const currentReviewDisputes = review && disputes.filter((dispute: IDispute) => dispute.reviewId === review.id)
    if (currentReviewDisputes && !currentReviewDisputes.length) {
      review && dispatch(updateReviewState({ ...review, state: ReviewState.ACCEPTED }))
    }
  };

  const handleCancel = () => {
    hideDetailsModal()
  };

  const onAddDispute = (value: any, itemId: string, disputId: string) => {
    if (!value[`comment${itemId}`] || !value[`suggestedScore${itemId}`]) {
      return
    }
    if (review) {
      try {
        console.log(disputId)
        const disputeDetails: IDispute = {
          id: disputId,
          reviewId: review.id,
          state: DisputeState.ONGOING,
          item: itemId,
          comment: value[`comment${itemId}`],
          suggestedScore: value[`suggestedScore${itemId}`],
        }
        dispatch(addDisputeData(disputeDetails))
        dispatch(updateReviewState({ ...review, state: ReviewState.DISPUTED }))
        message.success('The disput has been submitted');
      } catch(e) {
        message.error('An error occured. Please try later.');
      }

    }
  }

  const onDeleteDispute = (disputId: string) => {
    try {
      dispatch(deleteDisputeItem(disputId))
      message.success('The disput has been deleted');
    } catch(e) {
      message.error('An error occured. Please try later.');
    }
      }

  return (
    <Modal
      title={'Review details'}
      visible={visible}
      centered
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk} loading={isLoading}>
          {review && disputes.filter((dispute: IDispute) => dispute.reviewId === review.id).length ? 'OK' : 'ACCEPT'}
        </Button>,
      ]}
    >
      {data?.items ? data?.items.map((item: ITaskScoreItem) => {
        return (
          <DisputeForm item={item} key={item.id}  onAddDispute={onAddDispute} onDeleteDispute={onDeleteDispute} />
        )
      }) : <Result title={review ? "No review data" : "No self-check data"} />
      }
    </Modal>
  );
}
