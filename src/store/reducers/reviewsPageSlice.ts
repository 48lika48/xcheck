import { createSlice } from '@reduxjs/toolkit';
import { AppThunk } from '../store'
import { IReview } from '../../models';
import { getReviews } from '../../services/dbApi';
import { getGithubLogin } from '../../services/github-auth';

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
    setLoading(state){
      state.taskLoading = true;
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
    }
  },
})

export const {
  setLoading,
  getReviewsSuccess,
  getReviewsFail,
  sortReviewsByAuthor
} = reviewsPageSlice.actions

export const fetchReviewsByAuthor = ():AppThunk => async dispatch => {
  try {
    const reviews = await getReviews();
    dispatch(getReviewsSuccess(reviews))
    dispatch(sortReviewsByAuthor())
  }catch (err) {
    dispatch(getReviewsFail(err.toString()))
  }
}

export default reviewsPageSlice.reducer;
