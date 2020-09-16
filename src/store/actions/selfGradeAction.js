import { getTasks } from '../../services/heroku';

export const LOAD_TASK = 'LOAD_TASK';
export const LOAD_TASK_SUCCESS = 'LOAD_TASK_SUCCESS';
export const SAVE_SELF_CHECK = 'SAVE_SELF_CHECK';
export const SAVE_SELF_CHECK_SUCCESS = 'SAVE_SELF_CHECK_SUCCESS';
export const SAVE_SELF_CHECK_ERROR = 'SAVE_SELF_CHECK_ERROR';

export const loadTasks = (taskId) => {
  return async dispatch => {
    dispatch({ type: LOAD_TASK });
    await getTasks()
      .then(
        response => {
          if (response.status === 404) {
            throw new Error('404');
          } else {
            return response.json()
          }
        }
      )
      .then(
        payload => {
          dispatch({ type: LOAD_TASK_SUCCESS, payload , taskId })
        }
      )
      .catch(
        error => {
          if (error.message === '404') {
            dispatch({ type: LOAD_TASK });
          }
        }
      )
  }
}