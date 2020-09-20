import { combineReducers } from '@reduxjs/toolkit';
import { usersReducer, tasksReducer, reviewRequestReducer, reviewsPageReducer, crossSessionSlice } from './reducers';

const rootReducer = combineReducers({
  users: usersReducer,
  tasks: tasksReducer,
  reviewsPage: reviewsPageReducer,
  crossSessions: crossSessionSlice,
  reviewRequest: reviewRequestReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
