import { combineReducers } from '@reduxjs/toolkit';
import usersReducer from './reducers/usersSlice';
import reviewsPageReducer from './reducers/reviewsPageSlice';
import crossSessionSlice from './reducers/crossSessionsSlice';
import reviewRequestSlice from './reducers/reviewRequestSlice';

const rootReducer = combineReducers({
  users: usersReducer,
  reviewsPage: reviewsPageReducer,
  reviewRequest: reviewRequestSlice,
  crossSessions: crossSessionSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
