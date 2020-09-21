import { combineReducers } from '@reduxjs/toolkit';
import usersReducer from './reducers/usersSlice';
import reviewsPageReducer from './reducers/reviewsPageSlice';
import reviewRequestSlice from './reducers/reviewRequestSlice';
import selfGradeSlice from './reducers/selfGradeSlice';

const rootReducer = combineReducers({
  users: usersReducer,
  reviewsPage: reviewsPageReducer,
  reviewRequest: reviewRequestSlice,
  selfGradeSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
