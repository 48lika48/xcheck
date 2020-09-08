import React from 'react';
import './App.css';
import { LoginPage } from './pages';
import 'antd/dist/antd.css'

function App() {

  const login = () => console.log('login');


  return (
    <div className="App">
      <LoginPage login={login} />
    </div>
  );
}

export default App;
