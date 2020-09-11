import React from 'react';
import { ReviewRequestForm } from '../ReviewRequestForm';
import { ReviewRequestList } from '../ReviewRequestList';

export const ReviewRequestPage: React.FC = () => {
  
  return (
    <>
      <ReviewRequestForm />
      <ReviewRequestList />
    </>
  );
}
