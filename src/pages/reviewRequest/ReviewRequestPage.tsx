import React, { useState, useEffect } from 'react';
import { ReviewRequestForm } from './components';
import { ReviewRequestList } from './components';

import { getReviewRequest } from '../../services/rev-req';
import { getGithubLogin } from '../../services/github-auth';

export const ReviewRequestPage: React.FC = () => {

  const [reviewRequests, setReviewRequests] = useState([])
  const [githubLogin, setgithubLogin] = useState('')

  useEffect(() => {
    const getReviewRequests = async () => {
      const allRequests = await getReviewRequest();
      setReviewRequests(allRequests)
    }
    getReviewRequests()
    setgithubLogin(getGithubLogin())
  }, [])

  return (
    <>
      <ReviewRequestForm reviewRequests={reviewRequests} user={githubLogin} />
      <ReviewRequestList reviewRequests={reviewRequests} user={githubLogin}/>
    </>
  );
}
