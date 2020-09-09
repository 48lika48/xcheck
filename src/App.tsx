import React, { useState } from 'react';
import { LoginPage } from './pages';
import { Layout, Tabs } from 'antd';
import { UnorderedListOutlined, PullRequestOutlined, ScheduleTwoTone } from '@ant-design/icons';
import 'antd/dist/antd.css'
import './App.scss';

const { Header, Footer, Content } = Layout;
const { TabPane } = Tabs;

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  const loginHandler = (role: string): void => {
    setIsLoggedIn(true);
    setRole(role);
    console.log('login', ' role: ', role);
  }

  if (isLoggedIn) {
    return (
      <Layout>
        <Header>{role}</Header>
        <Content>
          <Tabs defaultActiveKey="1">
            <TabPane tab={<span><UnorderedListOutlined />Tasks</span>} key="1">
              Страница тасков
        </TabPane>
            <TabPane tab={<span><PullRequestOutlined />Review requests</span>} key="2">
              Страница зопроса на ревью
        </TabPane>
            <TabPane tab={<span><ScheduleTwoTone />Reviews</span>} key="3">
              Страница ревью
        </TabPane>
          </Tabs>
        </Content>
        <Footer>Footer</Footer>
      </Layout>

    )
  }

  return (
    <div className="App">
      <LoginPage login={loginHandler} />
    </div>
  );
}

export default App;
