import { createSlice } from '@reduxjs/toolkit';
import { ICheckSession, ICheckSessionAttendee, IReviewRequest } from '../../models';
import { AppThunk } from '../store';
import {
  addCheckSession,
  deleteCheckSession,
  getCheckSessions,
  getReviewRequests,
  updateCheckSession,
} from '../../services/heroku';
import { message } from 'antd';
import { shuffleArray } from '../../pages/crossSessionCreatePage/utils';

const successUpdate = () => {
  message.success('Session updated');
};

const successSave = () => {
  message.success('Session saved!');
};

const successDeleted = () => {
  message.warning('Session deleted!!!');
};
const reorderStudents = () => {
  message.success('Redistribution of students completed!');
};

interface ICrossSessionsSlice {
  loading: boolean;
  isShowModal: boolean;
  error: string | null;
  sessions: ICheckSession[];
  isEdit: boolean;
  editData: ICheckSession | null;
  requests: IReviewRequest[];
}
const initialState: ICrossSessionsSlice = {
  loading: false,
  error: null,
  sessions: [],
  isShowModal: false,
  isEdit: false,
  editData: null,
  requests: [],
};
const crossSessionSlice = createSlice({
  name: 'crossSessions',
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    endLoading(state) {
      state.loading = false;
    },
    setSessions(state, action) {
      state.sessions = action.payload;
    },
    showModal(state) {
      state.isShowModal = true;
    },
    hideModal(state) {
      state.isShowModal = false;
    },
    startEdit(state, action) {
      state.isEdit = !state.isEdit;
      if (state.sessions) {
        state.editData = state.sessions.filter((item) => item.id === action.payload)[0];
      }
    },
    endEdit(state) {
      state.isEdit = !state.isEdit;
      state.editData = null;
    },
  },
});

export const {
  startLoading,
  endLoading,
  setSessions,
  showModal,
  hideModal,
  startEdit,
  endEdit,
} = crossSessionSlice.actions;

export const fetchSessions = (): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading());
    const sessions = await getCheckSessions();
    dispatch(setSessions(sessions));
    dispatch(endLoading());
  } catch (err) {}
};
export const setSession = (data: ICheckSession): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading());
    await addCheckSession(data);
    await dispatch(fetchSessions());
    dispatch(endLoading());
    successSave();
  } catch (err) {
    dispatch(endLoading());
  }
};
export const editSession = (data: ICheckSession, sessionId: string): AppThunk => async (
  dispatch
) => {
  try {
    dispatch(startLoading());
    let shuffled = await getReviewRequests();
    let attendeeArray: ICheckSessionAttendee[] = [];
    shuffled = shuffleArray(
      shuffled.filter((request: IReviewRequest) => request.crossCheckSessionId === sessionId)
    );
    shuffled.forEach((item: IReviewRequest) =>
      attendeeArray.push({ githubId: item.author, reviewerOf: [] })
    );
    const length = shuffled.length;
    attendeeArray.forEach((item, index) => {
      if (index + data.desiredReviewersAmount + 1 > length) {
        shuffled
          .slice(index + 1)
          .forEach((i: IReviewRequest) => attendeeArray[index].reviewerOf.push(i.author));
        shuffled
          .slice(0, data.desiredReviewersAmount)
          .forEach((i: IReviewRequest) => attendeeArray[index].reviewerOf.push(i.author));
      } else {
        shuffled
          .slice(index + 1, index + data.desiredReviewersAmount + 1)
          .forEach((i: IReviewRequest) => attendeeArray[index].reviewerOf.push(i.author));
      }
    });
    if (data.state === 'CROSS_CHECK') {
      reorderStudents();
      data.attendees = attendeeArray;
    } else {
      data.attendees = [];
    }
    await updateCheckSession(data, sessionId);
    await dispatch(fetchSessions());
    dispatch(endLoading());
    successUpdate();
  } catch (err) {
    dispatch(endLoading());
  }
};
export const deleteSession = (id: string): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading());
    await deleteCheckSession(id);
    await dispatch(fetchSessions());
    dispatch(endLoading());
    successDeleted();
  } catch (err) {
    dispatch(endLoading());
    console.log(err);
  }
};

export default crossSessionSlice.reducer;
