import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';

import { Table, Space, Button, Tag, Input, Spin, Popconfirm } from 'antd';

import { ITask } from 'src/models';
import { fetchDeleteTask, startEditingTask } from 'src/store/reducers/tasksSlice';

const columns = [
  {
    title: 'Name',
    dataIndex: 'id',
    key: 'id',
    render: (text: string) => <Button type="link" style={{ padding: 0 }}>{text}</Button>,
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
      <Tag color={state === 'DRAFT' ? 'volcano' : 'green'}>
        {state.toUpperCase()}
      </Tag>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text: any, record: any) => (
      <Action taskId={text.id} />
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

const Action: React.FC<{ taskId: string }> = ({ taskId }) => {
  const { currentUser } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();
  const { currentRole } = currentUser;

  const handleDelete = (taskId: string) => {
    dispatch(fetchDeleteTask(taskId));
  }

  const handelEdit = (taskId: string) => {
    dispatch(startEditingTask(taskId));
  }

  if (currentRole === 'student') {
    return (
      <Space size="middle">
        <Button type="link" style={{ padding: 0 }}>Open</Button>
      </Space>
    )
  }

  return (
    <Space size="middle">
      <Button type="link" style={{ padding: 0 }} onClick={() => handelEdit(taskId)}>Edit</Button>
      <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(taskId)}>
        <Button type="link" style={{ padding: 0 }}>Delete</Button>
      </Popconfirm>
    </Space>
  )
}

export const Tasks: React.FC = () => {
  const { allTasks, isLoading } = useSelector((state: RootState) => state.tasks);

  const tasksWithKey = allTasks.map((task: ITask) => {
    return { ...task, key: task.id }
  })

  return (
    isLoading ?
      <div className="tasks-spiner">
        <Spin />
      </div> :
      <Table columns={columns}
        expandable={{
          expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
          rowExpandable: record => record.id !== 'Not Expandable',
        }}
        dataSource={tasksWithKey} />
  )
}

export default Tasks;
