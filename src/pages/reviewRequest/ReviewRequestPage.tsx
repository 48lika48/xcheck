import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReviewRequestForm, ReviewRequestList  } from './components';
import { IDispute, IReviewRequest, ITaskScore, IReview } from '../../models';
import { RootState } from 'src/store/rootReducer';
import { fetchAllData, addRequest, updateRequest, deleteRequestItem, addSelfGrade, addDisputeData, updateReviewState } from '../../store/reducers/reviewRequestSlice';

export const ReviewRequestPage: React.FC = () => {

  const dispatch = useDispatch();
  const { tasks, reviewRequests, reviews, isLoading, selfGrade } = useSelector((state: RootState) => state.reviewRequest)
  const { githubId } = useSelector((state: RootState) => state.users.currentUser.userData)

  useEffect(() => {
    dispatch(fetchAllData())
  }, [dispatch]);

  const deleteHandler = (requestId: string) => {
    dispatch(deleteRequestItem(requestId))
  }

  const submitHandlerAdd = (data: IReviewRequest) => {
    dispatch(addRequest(data))
  }

  const submitHandlerUpdate = (data: IReviewRequest, id: string) => {
    dispatch(updateRequest({ data, id }))
  }
  const submitDisputeHandler = (data: IDispute, review: IReview) => {
    dispatch(addDisputeData(data))
    dispatch(updateReviewState(review))
  }

  const selfGradeTogle = (data: ITaskScore | null) => {
    dispatch(addSelfGrade(data))
  }

  return (
    <>
      <ReviewRequestForm
        reviewRequests={reviewRequests}
        user={githubId} tasks={tasks}
        isLoading={isLoading}
        selfGrade={selfGrade}
        submitHandlerAdd={submitHandlerAdd}
        submitHandlerUpdate={submitHandlerUpdate}
        selfGradeTogle={selfGradeTogle}
     />
      <ReviewRequestList
        reviewRequests={reviewRequests}
        reviews={reviews}
        user={githubId}
        deleteHandler={deleteHandler}
        submitDisputeHandler={submitDisputeHandler}
        isLoading={isLoading}
      />
    </>
  );
}
