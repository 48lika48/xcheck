import { createSlice } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { ITask, ITaskScore } from 'src/models';

type selfGradeType = {
  task: ITask | null;
  loading: boolean;
  error: boolean;
  taskScore: ITaskScore;
};

const initialState: selfGradeType = {
  task: null,
  loading: false,
  error: false,
  taskScore: {
    task: '',
    items: [],
  },
};

const selfGradeSlice = createSlice({
  name: 'selfGrade',
  initialState,
  reducers: {
    loadTasks(state) {
      state.loading = true;
    },
    loadTaskSuccess(state, action) {
      state.loading = false;
      state.task = action.payload;
      state.taskScore.task = action.payload.id;
    },
    getTasksError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    saveTaskScoreResults(state, action) {
      if (state.taskScore.items.every((item) => item.id !== action.payload.id)) {
        state.taskScore.items.push(action.payload);
        return;
      }
      state.taskScore.items.forEach((item) => {
        if (item.id === action.payload.id) {
          item.score = action.payload.score;
          item.comment = action.payload.comment;
        }
      });
    },
  },
});

export const {
  loadTasks,
  loadTaskSuccess,
  getTasksError,
  saveTaskScoreResults,
} = selfGradeSlice.actions;

export const getData = (tasks: ITask[], taskName: string): AppThunk => async (dispatch) => {
  try {
    dispatch(loadTasks());
    const taskToCheck = tasks.find((task: { id: any }) => {
      if (task.id !== taskName) {
        return null;
      }
      return task;
    });
    dispatch(loadTaskSuccess(taskToCheck));
  } catch (err) {
    dispatch(getTasksError(err));
  }
};

export default selfGradeSlice.reducer;
