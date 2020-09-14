import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { RootState } from './store/rootReducer';
import { setCurrentUserRole } from './store/usersSlice';

import { LoginPage, Main } from './pages';
import 'antd/dist/antd.css'

import { checkAuthorization } from './services/github-auth';
import { checkUser } from './services/heroku';
import { UserRole } from './models';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state: RootState) => state);

  const lastRoleString = localStorage.getItem('lastRole');
  const currentRole = Object.values(UserRole).includes(lastRoleString as UserRole)
    ? UserRole[lastRoleString as UserRole]
    : UserRole.student;

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const asyncLogin = async () => {
      if (checkAuthorization()) {
        const access = await checkUser();
        if (access) setIsLoggedIn(true);
      }
    }
    asyncLogin();
  }, []);


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
