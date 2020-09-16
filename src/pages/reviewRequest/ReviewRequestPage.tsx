import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReviewRequestForm, ReviewRequestList  } from './components';
import { IReviewRequest } from '../../models';
import { RootState } from 'src/store/rootReducer';
import { fetchAllData, addRequest, deleteRequestItem } from '../../store/reducers/reviewRequestSlice';

export const ReviewRequestPage: React.FC = () => {

  const dispatch = useDispatch();
  const { tasks, reviewRequests, /*reviews,*/ isLoading } = useSelector((state: RootState) => state.reviewRequest)
  const { githubId } = useSelector((state: RootState) => state.users.currentUser.userData)

  useEffect(() => {
    dispatch(fetchAllData())
  }, [dispatch]);

  const deleteHandler = (requestId: string) => {
    dispatch(deleteRequestItem(requestId))
  }

  const submitHandler = (data: IReviewRequest) => {
    dispatch(addRequest(data))
  }

  return (
    <>
      <ReviewRequestForm
        reviewRequests={reviewRequests}
        user={githubId} tasks={tasks}
        isLoading={isLoading}
        submitHandler={submitHandler}
     />
      <ReviewRequestList reviewRequests={reviewRequests} user={githubId} deleteHandler={deleteHandler}/>
    </>
  );
}
