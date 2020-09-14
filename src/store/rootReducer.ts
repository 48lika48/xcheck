import { combineReducers } from '@reduxjs/toolkit'
import reviewsPageReducer from './reducers/reviewsPageSlice'

const rootReducer = combineReducers({
  reviewsPage: reviewsPageReducer
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
