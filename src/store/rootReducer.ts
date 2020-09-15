import { combineReducers } from '@reduxjs/toolkit';
import usersReducer from './reducers/usersSlice';
import reviewsPageReducer from './reducers/reviewsPageSlice';
import reviewRequestSlice from './reducers/reviewRequestSlice';
import selfGradeReducer from './reducers/selfGradeReducer';

const rootReducer = combineReducers({
  users: usersReducer,
  reviewsPage: reviewsPageReducer,
  reviewRequest: reviewRequestSlice,
  selfGradeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
