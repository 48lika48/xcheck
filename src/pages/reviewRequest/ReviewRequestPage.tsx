import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ReviewRequestForm, ReviewRequestList  } from './components';
import { fetchAllData } from '../../store/reducers/reviewRequestSlice';

export const ReviewRequestPage: React.FC = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllData())
  }, [dispatch]);

  return (
    <>
      <ReviewRequestForm />
      <ReviewRequestList />
    </>
  );
}
