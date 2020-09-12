import React from 'react';
import { ReviewRequestForm } from '../../components/ReviewRequestForm';
import { ReviewRequestList } from '../../components/ReviewRequestList';

export const ReviewRequestPage: React.FC = () => {
  
  return (
    <>
      <ReviewRequestForm />
      <ReviewRequestList />
    </>
  );
}
