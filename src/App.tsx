import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { RootState } from './store/rootReducer';
import { fetchUsers, setCurrentUserRole } from './store/reducers/usersSlice';

import { LoginPage, Main } from './pages';
import 'antd/dist/antd.css'

import { checkAuthorization, deleteCookie } from './services/github-auth';
import { UserRole } from './models';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser, error } = useSelector((state: RootState) => state.users);
  const [isLoggedIn, setIsLoggedIn] = useState(checkAuthorization());

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUsers(currentUser.currentRole));
    }
  }, [isLoggedIn, dispatch, currentUser.currentRole]);

  useEffect(() => {
    if (!error && checkAuthorization()) return setIsLoggedIn(true);
    setIsLoggedIn(false);
  }, [error]);

  useEffect(() => {
    const lastRoleString = localStorage.getItem('lastRole');
    const currentRole = Object.values(UserRole).includes(lastRoleString as UserRole)
      ? UserRole[lastRoleString as UserRole]
      : UserRole.student;
    dispatch(setCurrentUserRole(currentRole));
  }, [dispatch]);

  const logout = () => {
    deleteCookie();
    setIsLoggedIn(false);
  }

  return isLoggedIn
    ? <Main logoutHandler={logout} />
    : <LoginPage />;
}

export default App;
