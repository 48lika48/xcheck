import { combineReducers } from '@reduxjs/toolkit';
import { usersReducer, tasksReducer, reviewRequestReducer, reviewsPageReducer } from './reducers';

const rootReducer = combineReducers({
  users: usersReducer,
  tasks: tasksReducer,
  reviewsPage: reviewsPageReducer,
  reviewRequest: reviewRequestReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
