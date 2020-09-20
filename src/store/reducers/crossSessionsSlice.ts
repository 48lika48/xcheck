import { createSlice } from '@reduxjs/toolkit';
import { ICheckSession } from '../../models';
import { AppThunk } from '../store';
import { getCheckSessions } from '../../services/heroku';

interface ICrossSessionsSlice {
  loading: boolean;
  error: string | null;
  sessions: ICheckSession[];
}
const initialState: ICrossSessionsSlice = {
  loading: false,
  error: null,
  sessions: [],
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
  },
});

export const { startLoading, endLoading, setSessions } = crossSessionSlice.actions;

export const fetchSessions = (): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading());
    const sessions = await getCheckSessions();
    dispatch(setSessions(sessions));
    dispatch(endLoading());
  } catch (err) {}
};

export default crossSessionSlice.reducer;
