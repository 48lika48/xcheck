import React, { useState, useEffect } from 'react';
import { LoginPage, Main } from './pages';
import 'antd/dist/antd.css'

import { checkAuthorization } from './services/github-auth';
import { checkUser } from './services/heroku';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logout = () => {
    setIsLoggedIn(false);
  }

  useEffect(() => {
    const asyncLogin = async() => {
      if (checkAuthorization()) {
        const access = await checkUser();
        if (access) setIsLoggedIn(true);
      }
    }
    asyncLogin();
  }, []);

  return isLoggedIn ? <Main logoutHandler={logout} /> : <LoginPage />;
}

export default App;
