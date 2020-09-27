import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITask } from 'src/models';
import { getTasks, addTask, deleteTask, updateTask } from 'src/services/heroku';
import { AppThunk } from '../store';

interface ITasksState {
  allTasks: ITask[];
  editedTaskId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ITasksState = {
  allTasks: [],
  editedTaskId: null,
  isLoading: false,
  error: null,
};

function startLoading(state: ITasksState) {
  state.isLoading = true;
}

function loadingFailed(state: ITasksState, action: PayloadAction<string>) {
  state.isLoading = false;
  state.editedTaskId = null;
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
      state.isLoading = false;
    },
    startEditingTask(state, action: PayloadAction<string>) {
      state.editedTaskId = action.payload;
    },
    finishEditingTask(state) {
      state.editedTaskId = null;
    },
    fetchTaskFailure: loadingFailed,
  },
});

export const {
  fetchTaskStart,
  addNewTask,
  fetchTaskFailure,
  getAllTasks,
  startEditingTask,
  finishEditingTask,
} = usersSlice.actions;

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
    await addTask(task);
    dispatch(addNewTask(task));
  } catch (err) {
    dispatch(fetchTaskFailure(err.toString()));
  }
};

export const fetchDeleteTask = (taskId: string): AppThunk => async (dispatch) => {
  try {
    await deleteTask(taskId);
    dispatch(fetchTasks());
  } catch (err) {
    dispatch(fetchTaskFailure(err.toString()));
  }
};

export const fetchUpdateTask = (taskId: string, data: ITask): AppThunk => async (dispatch) => {
  try {
    dispatch(fetchTaskStart());
    const response = await updateTask(taskId, data);
    console.log(response);
    dispatch(finishEditingTask());
    dispatch(fetchTasks());
  } catch (err) {
    dispatch(fetchTaskFailure(err.toString()));
  }
};
