import { combineReducers } from '@reduxjs/toolkit'
import selfGradeReducer from './reducers/selfGradeReducer';
const rootReducer = combineReducers({
  selfGradeReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
