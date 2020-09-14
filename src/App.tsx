import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { RootState } from './store/rootReducer';
import { fetchUsers, setCurrentUserRole } from './store/reducers/usersSlice';

import { LoginPage, Main } from './pages';
import 'antd/dist/antd.css'

import { checkAuthorization } from './services/github-auth';
import { UserRole } from './models';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser, error } = useSelector((state: RootState) => state.users);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const asyncLogin = async () => {
      if (checkAuthorization()) {
        dispatch(fetchUsers(currentUser.currentRole));
      }
    }
    asyncLogin();
  }, [currentUser.currentRole, dispatch]);

  useEffect(() => {
    if (!error && checkAuthorization()) return setIsLoggedIn(true);
    setIsLoggedIn(false);
  }, [error]);

  const lastRoleString = localStorage.getItem('lastRole');
  const currentRole = Object.values(UserRole).includes(lastRoleString as UserRole)
    ? UserRole[lastRoleString as UserRole]
    : UserRole.student;

  useEffect(() => {
    dispatch(setCurrentUserRole(currentRole));
  }, [dispatch, currentRole]);

  const logout = () => {
    setIsLoggedIn(false);
  }

  return isLoggedIn
    ? <Main logoutHandler={logout} />
    : <LoginPage />;
}

export default App;
