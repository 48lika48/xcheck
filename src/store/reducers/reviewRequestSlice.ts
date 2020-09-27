import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store'
import { IReview, IReviewRequest, ITask, ITaskScore, IDispute, ICheckSession } from '../../models';
import {
  getTasks,
  getReviewRequests,
  getReviews,
  addReviewRequest,
  deleteReviewRequest,
  updateReviewRequest,
  addDispute,
  updateReview,
  deleteDispute,
  getCheckSessions,
} from 'src/services/heroku';

interface ReviewRequest {
  tasks: Array<ITask>,
  reviewRequests: Array<IReviewRequest>,
  reviews: Array<IReview>,
  error: string | null,
  isLoading: boolean,
  selfGrade: ITaskScore | null,
  disputes: Array<IDispute>,
  sessions: Array<ICheckSession>,
}

const initialState: ReviewRequest = {
  tasks: [],
  reviewRequests: [],
  reviews: [],
  error: null,
  isLoading: false,
  selfGrade: null,
  disputes: [],
  sessions: []
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
    getSessions(state, action: PayloadAction<Array<ICheckSession>>) {
      state.sessions = action.payload;
    },
    setRequest(state, action: PayloadAction<IReviewRequest>){
      state.reviewRequests.push(action.payload)
    },
    updateRequestData(state, action: PayloadAction<{data: IReviewRequest, id: string}>){
      const { data, id } = action.payload
      const request = state.reviewRequests.find((req: IReviewRequest) => req.id === id)
      const index = request && state.reviewRequests.indexOf(request)
      if (index && index !== -1) {
        state.reviewRequests.splice(index, 1, data)
      }
    },
    updateReviewData(state, action: PayloadAction<IReview>){
      const updatedRreview = state.reviews.find((review: IReview) => review.id === action.payload.id)
      const index = updatedRreview && state.reviews.indexOf(updatedRreview)
      if (index && index !== -1) {
        state.reviews.splice(index, 1, action.payload)
      }
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
    setSelfGrade(state, action: PayloadAction<ITaskScore | null>){
      state.selfGrade = action.payload
    },
    deleteRequestData(state, action: PayloadAction<string>){
      state.reviewRequests = state.reviewRequests.filter(request => request.id !== action.payload)
    },
    deleteDisputeData(state, action: PayloadAction<string>){
      state.disputes = state.disputes.filter(dispute => dispute.id !== action.payload)
    },
    setDisputeData(state, action: PayloadAction<IDispute>){
      state.disputes.push(action.payload)
    }
  },
})

export const {
  getTasksData,
  getReviewsData,
  getReviewRequestsData,
  getDataFailure,
  setReviewRequests,
  setIsLoading,
  setRequest,
  deleteRequestData,
  setSelfGrade,
  updateRequestData,
  setDisputeData,
  updateReviewData,
  deleteDisputeData,
  getSessions,
} = reviewRequestSlice.actions

export const fetchAllData = ():AppThunk => async dispatch => {
  try {
    dispatch(setIsLoading(true))
    const [ tasks, requests, reviews, checkSessions ] = await Promise.all([getTasks(), getReviewRequests(), getReviews(), getCheckSessions()]);
    dispatch(getTasksData(tasks))
    dispatch(getReviewRequestsData(requests))
    dispatch(getReviewsData(reviews))
    dispatch(getSessions(checkSessions))
  } catch (err) {
    dispatch(getDataFailure(err.toString()))
  } finally {
    dispatch(setIsLoading(false))
  }
}

export const addRequest = (data: IReviewRequest):AppThunk => async dispatch => {
  try {
    dispatch(setRequest(data))
    await addReviewRequest(data)
  } catch (err) {
    dispatch(getDataFailure(err.toString()))
  }
}

export const updateRequest = (arg: {data: IReviewRequest, id: string}):AppThunk => async dispatch => {
  const { data, id } = arg
  try {
    dispatch(updateRequestData(arg))
    await updateReviewRequest(data, id)
  } catch (err) {
    dispatch(getDataFailure(err.toString()))
  }
}

export const updateReviewState = (review: IReview):AppThunk => async dispatch => {
  try {
    dispatch(updateReviewData(review))
    await updateReview(review)
  } catch (err) {
    dispatch(getDataFailure(err.toString()))
  }
}

export const addSelfGrade = (data: ITaskScore | null):AppThunk => dispatch => {
    dispatch(setSelfGrade(data))
}

export const addDisputeData = (data: IDispute):AppThunk => async dispatch => {
  dispatch(setIsLoading(true))
  try {
    dispatch(setDisputeData(data))
    await addDispute(data)
  } catch (err) {
    dispatch(getDataFailure(err.toString()))
  } finally {
    dispatch(setIsLoading(false))
  }

}

export const deleteRequestItem = (requestId: string):AppThunk => async dispatch => {
  try {
    deleteReviewRequest(requestId)
    dispatch(deleteRequestData(requestId))
  } catch (err) {
    dispatch(getDataFailure(err.toString()))
  }
}

export const deleteDisputeItem = (disputeId: string):AppThunk => async dispatch => {
  try {
    dispatch(deleteDisputeData(disputeId))
    await deleteDispute(disputeId)
  } catch (err) {
    dispatch(getDataFailure(err.toString()))
  }
}

export default reviewRequestSlice.reducer;
