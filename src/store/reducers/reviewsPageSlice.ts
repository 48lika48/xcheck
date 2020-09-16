import { createSlice } from '@reduxjs/toolkit';
import { AppThunk } from '../store'
import { IReview, IReviewRequest } from '../../models';
import { getReviewRequests, getReviews } from '../../services/dbApi';
import { getGithubLogin } from '../../services/github-auth';

interface IReviewTableData extends IReview {
  key: number
}

const initialState ={
  taskLoading: true,
  dataLoading: false,
  reviews: [],
  error: null,
}

const reviewsPageSlice = createSlice({
  name: 'reviewPage',
  initialState,
  reducers:{
    startLoading(state){
      state.taskLoading = true;
    },
    endLoading(state){
      state.taskLoading = false;
    },
    getReviewsSuccess(state, action){
      state.taskLoading = false
      state.error = null
      state.reviews = action.payload
    },
    getReviewsFail(state, action){
      state.taskLoading = false
      state.error = action.payload
    },
    sortReviewsByAuthor(state){
      const name = getGithubLogin();
      state.reviews = state.reviews.filter((item: IReview) => item.author === name)
    },
    setData(state, action){
      state.reviews.forEach((item: IReviewTableData, index: number) => {
        const x = action.payload.find((x: IReviewRequest) => x.id === item.requestId)
        item.reviewedStudent = x.author
        item.task = x.task
        item.key = index
      })
    },
  },
})

export const {
  startLoading,
  endLoading,
  getReviewsSuccess,
  getReviewsFail,
  sortReviewsByAuthor,
  setData
} = reviewsPageSlice.actions

export const fetchReviewsByAuthor = ():AppThunk => async dispatch => {
  try {
    const reviews = await getReviews();
    dispatch(getReviewsSuccess(reviews))
    dispatch(sortReviewsByAuthor())
    dispatch(fetchReviewsRequests())
  }catch (err) {
    dispatch(getReviewsFail(err.toString()))
  }
}

export const fetchReviewsRequests = ():AppThunk => async dispatch => {
  try {
    dispatch(startLoading())
    const reviewRequests = await getReviewRequests();
    dispatch(setData(reviewRequests))
    dispatch(endLoading())

  }catch (err) {
    dispatch(getReviewsFail(err.toString()))
  }
}

export default reviewsPageSlice.reducer;
