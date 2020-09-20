import React from 'react';

import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';

import { Layout, Tabs, PageHeader, Button, Tooltip } from 'antd';
import {
  UnorderedListOutlined,
  PullRequestOutlined,
  ScheduleTwoTone,
  LogoutOutlined,
} from '@ant-design/icons';

import { getGithubUserName } from '../../services/github-auth';

import { ReviewRequestPage } from '../reviewRequest';

import './Main.scss';
import { ReviewPage } from '../reviews';

import TaskManager from '../../forms/index';
import { CrossSessionsPage } from '../crossSessionsPage';

const { Footer, Content } = Layout;
const { TabPane } = Tabs;

export const Main: React.FC<{ logoutHandler: any }> = ({ logoutHandler }) => {
  const { users } = useSelector((state: RootState) => state);
  const userName = getGithubUserName() || users.currentUser.userData.githubId;

  return (
    <Layout>
      <PageHeader
        className="site-page-header"
        title="RS School xCheck"
        subTitle={`${userName} (${users.currentUser.currentRole.replace('_', ' ')})`}
        extra={
          <Tooltip title="logout">
            <Button type="link" shape="circle" icon={<LogoutOutlined onClick={logoutHandler} />} />
          </Tooltip>
        }
      />
      <Content>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <UnorderedListOutlined />
                Tasks
              </span>
            }
            key="1"
          >
            <TaskManager />
          </TabPane>
          <TabPane
            tab={
              <span>
                <PullRequestOutlined />
                Review requests
              </span>
            }
            key="2"
          >
            <ReviewRequestPage />
          </TabPane>
          <TabPane
            tab={
              <span>
                <ScheduleTwoTone />
                Reviews
              </span>
            }
            key="3"
          >
            <ReviewPage />
          </TabPane>
          {users.currentUser.currentRole === 'author' && (
            <TabPane
              tab={
                <span>
                  <ScheduleTwoTone />
                  Check Sessions
                </span>
              }
              key="4"
            >
              <CrossSessionsPage />
            </TabPane>
          )}
        </Tabs>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
};
