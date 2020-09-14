import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser, UserRole } from 'src/models';

const defaultUser = { id: '', githubId: '', roles: [UserRole.student] };

const initialState = {
  currentUser: {
    userData: defaultUser,
    currentRole: 'UserRole.student',
  },
  allUsers: [defaultUser],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentUserRole(state, action: PayloadAction<UserRole>) {
      state.currentUser.currentRole = action.payload;
      localStorage.lastRole = action.payload;
    },
    getAllUsers(state, action: PayloadAction<IUser[]>) {
      state.allUsers = action.payload;
    },
  },
});

export const { setCurrentUserRole, getAllUsers } = usersSlice.actions;

export default usersSlice.reducer;
