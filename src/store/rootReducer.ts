import { combineReducers } from '@reduxjs/toolkit';
import {
  usersReducer,
  tasksReducer,
  reviewRequestReducer,
  reviewsPageReducer,
  crossSessionSlice,
  selfGradeSlice,
  reviewCreateSlice,
} from './reducers';

const rootReducer = combineReducers({
  users: usersReducer,
  tasks: tasksReducer,
  reviewsPage: reviewsPageReducer,
  reviewCreate: reviewCreateSlice,
  crossSessions: crossSessionSlice,
  reviewRequest: reviewRequestReducer,
  selfGradeSlice: selfGradeSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
