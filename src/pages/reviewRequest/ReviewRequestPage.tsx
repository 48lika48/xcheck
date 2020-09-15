import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReviewRequestForm, ReviewRequestList  } from './components';
import { RootState } from 'src/store/rootReducer';
import { fetchAllData } from '../../store/reducers/reviewRequestSlice';

export const ReviewRequestPage: React.FC = () => {

  const dispatch = useDispatch();
  const { tasks, reviewRequests, /*reviews,*/ isLoading } = useSelector((state: RootState) => state.reviewRequest)
  const { githubId } = useSelector((state: RootState) => state.users.currentUser.userData)

  useEffect(() => {
    dispatch(fetchAllData())
  }, [dispatch]);

  return (
    <>
      <ReviewRequestForm reviewRequests={reviewRequests} user={githubId} tasks={tasks} isLoading={isLoading} />
      <ReviewRequestList reviewRequests={reviewRequests} user={githubId} />
    </>
  );
}
