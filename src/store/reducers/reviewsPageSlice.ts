import { createSlice } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { ICheckSession, IReview, IReviewRequest } from '../../models';
import { getReviews } from '../../services/dbApi';
import { getGithubLogin } from '../../services/github-auth';
import { getCheckSessions, getReviewRequests } from '../../services/heroku';

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
  error: string | null;
}

const initialState: IReviewPage = {
  taskLoading: true,
  dataLoading: false,
  reviews: [],
  sessions: [],
  requests: [],
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
      state.sessions.push(action.payload);
    },
    setRequests(state, action) {
      if (state.requests.findIndex((item) => item.id === action.payload.id) === -1) {
        state.requests.push(action.payload);
      }
    },
    setData(state, action) {
      state.reviews.forEach((item: IReviewTableData, index: number) => {
        const x = action.payload.find((x: IReviewRequest) => x.id === item.requestId);
        item.reviewedStudent = x.author;
        item.task = x.task;
        item.key = index;
      });
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
} = reviewsPageSlice.actions;

export const fetchReviewsByAuthor = (): AppThunk => async (dispatch) => {
  try {
    const reviews = await getReviews();
    dispatch(getReviewsSuccess(reviews));
    dispatch(sortReviewsByAuthor());
    dispatch(fetchReviewsRequests());
  } catch (err) {
    dispatch(getReviewsFail(err.toString()));
  }
};

export const fetchReviewsRequests = (): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading());
    const reviewRequests = await getReviewRequests();
    dispatch(setData(reviewRequests));
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
    const session = await getCheckSessions();
    let requests = await getReviewRequests();
    session.forEach((session: ICheckSession) => {
      if (session.state === 'CROSS_CHECK' && session.attendees) {
        requests = requests.filter(
          (item: IReviewRequest) => item.crossCheckSessionId === session.id
        );
        requests = requests.filter((item: IReviewRequest) => item.state === 'PUBLISHED');
        const attendeesStudents = session.attendees.find((item) => item.githubId === user)
          ?.reviewerOf;
        attendeesStudents?.forEach((item) => {
          const id = requests.find((request: IReviewRequest) => request.author === item);
          if (id) {
            dispatch(setRequests(id));
          }
        });
      }
    });
  } catch (err) {
    dispatch(endLoading());
    dispatch(getReviewsFail(err.toString()));
  }
};

export default reviewsPageSlice.reducer;
