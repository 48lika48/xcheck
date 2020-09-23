import { createSlice } from '@reduxjs/toolkit';
import { ICheckSession } from '../../models';
import { AppThunk } from '../store';
import {
  addCheckSession,
  deleteCheckSession,
  getCheckSessions,
  updateCheckSession,
} from '../../services/heroku';
import { message } from 'antd';

const successUpdate = () => {
  message.success('Session updated');
};

const successSave = () => {
  message.success('Session saved!');
};

const successDeleted = () => {
  message.warning('Session deleted!!!');
};

interface ICrossSessionsSlice {
  loading: boolean;
  isShowModal: boolean;
  error: string | null;
  sessions: ICheckSession[];
  isEdit: boolean;
  editData: ICheckSession | null;
}
const initialState: ICrossSessionsSlice = {
  loading: false,
  error: null,
  sessions: [],
  isShowModal: false,
  isEdit: false,
  editData: null,
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
