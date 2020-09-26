import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';

import { Table, Space, Button, Tag, Input, Spin } from 'antd';

import { ITask } from 'src/models';

const columns = [
  {
    title: 'Name',
    dataIndex: 'id',
    key: 'id',
    render: (text: string) => <Button type="link">{text}</Button>,
  },
  {
    title: 'Deadline',
    dataIndex: 'endDate',
    key: 'endDate',
    render: (text: string) => `${text.slice(0, 10)} ${text.slice(11, text.length - 6)}`
  },
  {
    title: 'Author',
    dataIndex: 'author',
    key: 'author',
  },
  {
    title: 'Status',
    key: 'state',
    dataIndex: 'state',
    render: (state: string) => (
      <Tag color = {state === 'DRAFT' ? 'volcano' : 'green'}>
        {state.toUpperCase()}
      </Tag>
    ),

  },
  {
    title: 'Action',
    key: 'action',
    render: (text: any, record: any) => (
      <Action/>
    ),
  },
  {
    title: 'Comment',
    dataIndex: 'comment',
    key: 'comment',
    render: (text: string) => (
      <Input placeholder="" bordered={true} />
    ),
  },
];

const Action: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.users);
  const { currentRole } = currentUser;

  if (currentRole === 'student') {
    return (
      <Space size="middle">
        <Button type="link">Open</Button>
      </Space>
    )
  }

  return (
    <Space size="middle">
      <Button type="link">Edit</Button>
      <Button type="link">Delete</Button>
    </Space>
  )
}

export const Tasks: React.FC = () => {
  const { allTasks, isLoading } = useSelector((state: RootState) => state.tasks);

  const tasksWithKey = allTasks.map((task: ITask) => {
    return { ...task, key: task.id }
  })

  return (
    isLoading ? <div className="tasks-spiner">
      <Spin />
    </div> : <Table columns={columns} dataSource={tasksWithKey} />
  )
}

export default Tasks;
