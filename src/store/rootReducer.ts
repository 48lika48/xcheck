import { combineReducers } from '@reduxjs/toolkit';
import usersReducer from './reducers/usersSlice';
import reviewsPageReducer from './reducers/reviewsPageSlice';

const rootReducer = combineReducers({
  users: usersReducer,
  reviewsPage: reviewsPageReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
