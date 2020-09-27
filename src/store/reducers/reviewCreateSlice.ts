import { createSlice /* PayloadAction */ } from '@reduxjs/toolkit';
// import { AppThunk } from '../store';
import { IReviewRequest /* IReview, ITask, ITaskScore, IDispute */ } from '../../models';

interface IReviewCreateSlice {
  isShowModal: boolean;
  request: IReviewRequest | null;
}
const initialState = {
  isShowModal: false,
  request: null,
};

const reviewCreateSlice = createSlice({
  name: 'reviewCreate',
  initialState,
  reducers: {
    showModal(state) {
      state.isShowModal = true;
    },
    hideModal(state) {
      state.isShowModal = false;
    },
    setRequest(state, action) {
      state.request = action.payload;
    },
  },
});
export const { hideModal, showModal, setRequest } = reviewCreateSlice.actions;
export default reviewCreateSlice.reducer;
