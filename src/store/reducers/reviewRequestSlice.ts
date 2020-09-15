import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store'
import { IReview, IReviewRequest, ITask } from '../../models';
import { getTasks, getReviewRequests, getReviews } from 'src/services/heroku';

interface ReviewRequest {
  tasks: Array<ITask>,
  reviewRequests: Array<IReviewRequest>,
  reviews: Array<IReview>,
  error: string | null,
  isLoading: boolean,
}

const initialState: ReviewRequest = {
  tasks: [],
  reviewRequests: [],
  reviews: [],
  error: null,
  isLoading: false,
}

const reviewRequestSlice = createSlice({
  name: 'reviewRequests',
  initialState,
  reducers:{
    getTasksData(state, action: PayloadAction<Array<ITask>>){
      state.error = null
      state.tasks = action.payload
    },
    getReviewsData(state, action: PayloadAction<Array<IReview>>){
      state.error = null
      state.reviews = action.payload
    },
    getReviewRequestsData(state, action: PayloadAction<Array<IReviewRequest>>){
      state.error = null
      state.reviewRequests = action.payload
    },
    getDataFailure(state, action: PayloadAction<string | null>){
      state.error = action.payload
    },
    setReviewRequests(state, action: PayloadAction<IReviewRequest>){
      state.reviewRequests.push(action.payload)
    },
    setIsLoading(state, action: PayloadAction<boolean>){
      state.isLoading = action.payload
    },
  },
})

export const {
  getTasksData,
  getReviewsData,
  getReviewRequestsData,
  getDataFailure,
  setReviewRequests,
  setIsLoading,
} = reviewRequestSlice.actions

export const fetchAllData = ():AppThunk => async dispatch => {
  try {
    dispatch(setIsLoading(true))
    const [ tasks, requests, reviews ] = await Promise.all([getTasks(), getReviewRequests(), getReviews()]);
    dispatch(getTasksData(tasks))
    dispatch(getReviewRequestsData(requests))
    dispatch(getReviewsData(reviews))
  } catch (err) {
    dispatch(getDataFailure(err.toString()))
  } finally {
    dispatch(setIsLoading(false))
  }
}

export default reviewRequestSlice.reducer;
