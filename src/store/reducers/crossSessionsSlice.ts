import { createSlice } from '@reduxjs/toolkit';

interface ICrossSessionsSlice {
  error: string | null;
}
const initialState: ICrossSessionsSlice = {
  error: null,
};
const crossSessionSlice = createSlice({
  name: 'crossSessions',
  initialState,
  reducers: {},
});

export default crossSessionSlice.reducer;
