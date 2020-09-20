import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser, UserRole } from 'src/models';
import { getGithubLogin } from 'src/services/github-auth';
import { getUsers, registerUser } from 'src/services/heroku';
import { AppThunk } from '../store';

const defaultUser = { id: '', githubId: '', roles: [UserRole.student] };

interface UsersState {
  currentUser: {
    userData: IUser;
    currentRole: UserRole;
  };
  allUsers: {}[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  currentUser: {
    userData: defaultUser,
    currentRole: UserRole.student,
  },
  allUsers: [defaultUser],
  isLoading: false,
  error: null,
};

function startLoading(state: UsersState) {
  state.isLoading = true;
}

function loadingFailed(state: UsersState, action: PayloadAction<string>) {
  state.isLoading = false;
  state.error = action.payload;
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    getUsersStart: startLoading,
    setCurrentUserRole(state, action: PayloadAction<UserRole>) {
      state.currentUser.currentRole = action.payload;
      localStorage.lastRole = action.payload;
    },
    getAllUsers(state, action: PayloadAction<IUser[]>) {
      state.allUsers = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCurrentUser(state, action: PayloadAction<IUser>) {
      state.currentUser.userData = action.payload;
    },
    getUsersFailure: loadingFailed,
  },
});

export const {
  setCurrentUserRole,
  setCurrentUser,
  getAllUsers,
  getUsersStart,
  getUsersFailure,
} = usersSlice.actions;

export default usersSlice.reducer;

export const fetchUsers = (currentRole: UserRole): AppThunk => async (dispatch) => {
  try {
    dispatch(getUsersStart());
    const users = await getUsers();
    dispatch(getAllUsers(users));

    const githubLogin = getGithubLogin();
    const currentUser: IUser = users.find(({ githubId }: IUser) => githubLogin === githubId);

    if (!currentUser && currentRole === UserRole.student) {
      const newUser = await registerUser(githubLogin, users);
      return dispatch(setCurrentUser(newUser));
    }

    if (currentUser.roles.includes(currentRole) || currentRole === UserRole.student) {
      return dispatch(setCurrentUser(currentUser));
    }
    throw Error('no acces');
  } catch (err) {
    dispatch(getUsersFailure(err.toString()));
  }
};
