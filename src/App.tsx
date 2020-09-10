import React, { useState, useEffect } from 'react';
import { LoginPage } from './pages';
import { Layout, Tabs, PageHeader, Button, Tooltip } from 'antd'
import { UnorderedListOutlined, PullRequestOutlined, ScheduleTwoTone, LogoutOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css'
import './App.scss';
import { checkGihubCookie, getGithubUserName, deleteCookie } from './utils/githubCookies';


const { Footer, Content } = Layout;
const { TabPane } = Tabs;

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');


  useEffect(() => {
    if (checkGihubCookie()) {
      const role = localStorage.getItem('role');

      setIsLoggedIn(true);
      setRole(role || 'student'); //TODO
    }
  }, []);

  if (isLoggedIn) {
    return (
      <Layout>
        <PageHeader
          className="site-page-header"
          title="RS School XCheck"
          subTitle={`${getGithubUserName()} (${role})`}
          extra={
            <Tooltip title="logout">
              <Button type="link" shape="circle" icon={<LogoutOutlined onClick={() => { setIsLoggedIn(false); deleteCookie() }} />} />
            </Tooltip>
          }
        />
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

  return <LoginPage />;
}

export default App;
