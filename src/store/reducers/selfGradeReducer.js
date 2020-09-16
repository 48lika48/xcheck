import {
  LOAD_TASK,
  LOAD_TASK_SUCCESS,
  // SAVE_SELF_CHECK,
  // SAVE_SELF_CHECK_SUCCESS,
  // SAVE_SELF_CHECK_ERROR,
} from '../actions/selfGradeAction';

const initialState = {
  task: [],
  loading: false,
}

const selfGradeReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_TASK:
      return {
        ...state,
        loading: true,
      }
    case LOAD_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        task: action.payload.find(task => {
          if (task.id !== action.taskId) {
            return null;
          }
          return task;
        }),
      }
    default:
      return state;
  }
}

export default selfGradeReducer;