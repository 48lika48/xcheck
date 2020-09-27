import { createSlice } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { CrossCheckSessionState, ICheckSession, IReview, IReviewRequest } from '../../models';
import { getReviews } from '../../services/dbApi';
import { getGithubLogin } from '../../services/github-auth';
import { addReview, getCheckSessionsByState, getReviewRequests } from '../../services/heroku';

interface IReviewTableData extends IReview {
  key: number;
  reviewedStudent: string;
  task: string;
}

interface IReviewPage {
  taskLoading: boolean;
  dataLoading: boolean;
  reviews: IReviewTableData[];
  sessions: ICheckSession[];
  requests: IReviewRequest[];
  requestsForReview: IReviewRequest[];
  error: string | null;
}

const initialState: IReviewPage = {
  taskLoading: true,
  dataLoading: false,
  reviews: [],
  sessions: [],
  requests: [],
  requestsForReview: [],
  error: null,
};

const reviewsPageSlice = createSlice({
  name: 'reviewPage',
  initialState,
  reducers: {
    startLoading(state) {
      state.taskLoading = true;
    },
    endLoading(state) {
      state.taskLoading = false;
    },
    getReviewsSuccess(state, action) {
      state.taskLoading = false;
      state.error = null;
      state.reviews = action.payload;
    },
    getReviewsFail(state, action) {
      state.taskLoading = false;
      state.error = action.payload;
    },
    sortReviewsByAuthor(state) {
      const name = getGithubLogin();
      state.reviews = state.reviews.filter((item: IReview) => item.author === name);
    },
    setSessions(state, action) {
      state.sessions = action.payload;
    },
    setRequests(state, action) {
      if (state.requests.findIndex((item) => item.id === action.payload.id) === -1) {
        state.requests.push(action.payload);
      }
    },
    setRqForReviews(state, action) {
      let reviewsId: string[] = [];
      state.reviews.forEach((review) => reviewsId.push(review.requestId));
      action.payload
        .filter((item: IReviewRequest) => !reviewsId.includes(item.id))
        .forEach((i: IReviewRequest) => state.requestsForReview.push(i));
    },
    setData(state, action) {
      state.reviews.forEach((item: IReviewTableData, index: number) => {
        const x = action.payload.find((x: IReviewRequest) => x.id === item.requestId);
        item.reviewedStudent = x.author;
        item.task = x.task;
        item.key = index;
      });
    },
    resetRequests(state) {
      state.requestsForReview = [];
    },
  },
});

export const {
  startLoading,
  endLoading,
  getReviewsSuccess,
  getReviewsFail,
  sortReviewsByAuthor,
  setData,
  setSessions,
  setRequests,
  resetRequests,
  setRqForReviews,
} = reviewsPageSlice.actions;

export const fetchReviewsByAuthor = (): AppThunk => async (dispatch) => {
  try {
    const reviews = await getReviews();
    dispatch(getReviewsSuccess(reviews));
    dispatch(sortReviewsByAuthor());
  } catch (err) {
    dispatch(getReviewsFail(err.toString()));
  }
};

export const fetchReviewsRequests = (): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading());
    const reviewRequests = await getReviewRequests();
    dispatch(setData(reviewRequests));
    await dispatch(setRequests(reviewRequests));
    dispatch(endLoading());
  } catch (err) {
    dispatch(endLoading());
    dispatch(getReviewsFail(err.toString()));
  }
};

export const fetchRequestsToReview = (): AppThunk => async (dispatch) => {
  const user = getGithubLogin();
  try {
    dispatch(startLoading());
    const sessions = await getCheckSessionsByState(CrossCheckSessionState.CROSS_CHECK);
    const requests: IReviewRequest[] = await getReviewRequests();
    if (sessions) {
      sessions.forEach((item) => {
        const sessionAttendees = item.attendees.filter((attendee) => attendee.githubId === user)[0];
        let sortedReq = requests.filter((request) => request.crossCheckSessionId === item.id);
        sortedReq = sortedReq.filter((req) => sessionAttendees.reviewerOf.includes(req.author));
        dispatch(setRqForReviews(sortedReq));
      });
    }
  } catch (err) {
    dispatch(endLoading());
    dispatch(getReviewsFail(err.toString()));
  }
};

export const setReview = (data: IReview): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading());
    await addReview(data);
  } catch (e) {
    dispatch(endLoading());
  }
};

export default reviewsPageSlice.reducer;
