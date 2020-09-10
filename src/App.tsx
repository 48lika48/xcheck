import React, { useState, useEffect } from 'react';
import { LoginPage, Main } from './pages';
import 'antd/dist/antd.css'

import { checkGihubCookie } from './utils/githubCookies';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logout = () => {
    setIsLoggedIn(false);
  }

  useEffect(() => {
    if (checkGihubCookie()) {
      setIsLoggedIn(true);
    }
  }, []);

  return isLoggedIn ? <Main logoutHandler={logout} /> : <LoginPage />;
}

export default App;
