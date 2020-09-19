import { createSlice } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { getTasks } from '../../services/heroku';
import { ITask } from 'src/models';

type selfGradeType = {
	task: ITask | null;
	loading: boolean;
	error: boolean;
	selfGrade: scoreType;
};

export type ItemsType = {
	id: string;
	score: number;
	comment: string;
};

type scoreType = {
	task: string;
	items: Array<ItemsType>;
};

const initialState: selfGradeType = {
	task: null,
	loading: false,
	error: false,
	selfGrade: {
		task: '',
		items: []
	}
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
			state.selfGrade.task = action.payload.id;
		},
		getTasksError(state, action) {
			state.error = action.payload;
			state.loading = false;
		},
		saveTaskScoreResults(state, action) {
			if (state.selfGrade.items.every((item) => item.id !== action.payload.id)) {
				state.selfGrade.items.push(action.payload);
				return;
			}
			state.selfGrade.items.forEach((item) => {
				if (item.id === action.payload.id) {
					item.score = action.payload.score;
					item.comment = action.payload.comment;
				}
			});
		}
	}
});

export const { loadTasks, loadTaskSuccess, getTasksError, saveTaskScoreResults } = selfGradeSlice.actions;

export const fetchTasks = (task: string): AppThunk => async (dispatch) => {
	try {
		dispatch(loadTasks());
		const response = await getTasks();
		const tasks = await response.json();
		const taskToCheck = tasks.find((task: { id: any }) => {
			if (task.id !== task) {
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
