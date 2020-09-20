import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITask } from 'src/models';
import { getTasks, addTask } from 'src/services/heroku';
import { AppThunk } from '../store';

interface ITasksState {
  allTasks: ITask[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ITasksState = {
  allTasks: [],
  isLoading: false,
  error: null,
};

function startLoading(state: ITasksState) {
  state.isLoading = true;
}

function loadingFailed(state: ITasksState, action: PayloadAction<string>) {
  state.isLoading = false;
  state.error = action.payload;
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchTaskStart: startLoading,
    getAllTasks(state, action: PayloadAction<ITask[]>) {
      state.allTasks = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addNewTask(state, action: PayloadAction<ITask>) {
      state.allTasks = [...state.allTasks, action.payload];
    },
    fetchTaskFailure: loadingFailed,
  },
});

export const { fetchTaskStart, addNewTask, fetchTaskFailure, getAllTasks } = usersSlice.actions;

export default usersSlice.reducer;

export const fetchTasks = (): AppThunk => async (dispatch) => {
  try {
    dispatch(fetchTaskStart());
    const tasks = await getTasks();
    dispatch(getAllTasks(tasks));
  } catch (err) {
    dispatch(fetchTaskFailure(err.toString()));
  }
};

export const fetchNewTask = (task: ITask): AppThunk => async (dispatch) => {
  try {
    dispatch(fetchTaskStart());
    const response = await addTask(task);
    console.log(response);
    dispatch(addNewTask(task));
  } catch (err) {
    dispatch(fetchTaskFailure(err.toString()));
  }
};
