import React from 'react';

import { Layout, Tabs, PageHeader, Button, Tooltip } from 'antd'
import { UnorderedListOutlined, PullRequestOutlined, ScheduleTwoTone, LogoutOutlined } from '@ant-design/icons';

import { getGithubUserName, deleteCookie } from '../../services/github-auth';

import './Main.scss';

import TaskManager from '../../forms/index'

const { Footer, Content } = Layout;
const { TabPane } = Tabs;

export const Main: React.FC<{ logoutHandler: any }> = (props) => {

  const role = localStorage.getItem('role') || 'student';

  return (
    <Layout>
      <PageHeader
        className="site-page-header"
        title="RS School xCheck"
        subTitle={`${getGithubUserName()} (${role})`}
        extra={
          <Tooltip title="logout">
            <Button type="link" shape="circle"
              icon={<LogoutOutlined onClick={() => { props.logoutHandler(); deleteCookie() }} />} />
          </Tooltip>
        }
      />
      <Content>
        <Tabs defaultActiveKey="1">
          <TabPane tab={<span><UnorderedListOutlined />Tasks</span>} key="1">
            <TaskManager />
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
