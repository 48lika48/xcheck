import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';

import { Table, Space, Button, Tag, Input, Spin, Popconfirm, Popover, List } from 'antd';
import { CheckCircleOutlined, RightCircleOutlined } from '@ant-design/icons';

import { ITask, TaskState, UserRole } from 'src/models';
import { changeTaskStatus, fetchDeleteTask, startEditingTask } from 'src/store/reducers/tasksSlice';

const Action: React.FC<{ taskId: string }> = ({ taskId }) => {
  const { currentUser } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();
  const { currentRole } = currentUser;

  const handleDelete = (taskId: string) => {
    dispatch(fetchDeleteTask(taskId));
  }

  const handleOpenTask = (taskId: string) => {
    dispatch(startEditingTask(taskId));
  }

  if (currentRole === 'student') {
    return (
      <Space size="middle">
        <Button type="link" style={{ padding: 0 }} onClick={() => handleOpenTask(taskId)}>Open</Button>
      </Space>
    )
  }

  return (
    <Space size="middle">
      <Button type="link" style={{ padding: 0 }} onClick={() => handleOpenTask(taskId)}>Edit</Button>
      <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(taskId)}>
        <Button type="link" style={{ padding: 0 }}>Delete</Button>
      </Popconfirm>
    </Space>
  )
}

export const Tasks: React.FC = () => {
  const dispatch = useDispatch();
  const { allTasks, isLoading } = useSelector((state: RootState) => state.tasks);
  const { currentRole } = useSelector((state: RootState) => state.users.currentUser);

  const defaulVisiblePopovers: { [key: string]: boolean } = {};
  allTasks.forEach((item: ITask) => defaulVisiblePopovers[item.id] = false)
  const [isVisiblePopover, setVisiblePopover] = useState(defaulVisiblePopovers);


  const tasksWithKey = allTasks.map((task: ITask) => {
    return { ...task, key: task.id }
  });

  const handleVisiblePopover = (visible: boolean, id: string) => {
    if (currentRole !== UserRole.student) {
      defaulVisiblePopovers[id] = visible;
      setVisiblePopover({ ...defaulVisiblePopovers });
    }
  }

  const handleTaskStatusChange = (id: string, status: TaskState) => {
    dispatch(changeTaskStatus(id, status));
  }

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
      render: (state: string, data: any) => (
        <Popover
          content={
            <List
              itemLayout="horizontal"
              dataSource={[TaskState.DRAFT, TaskState.PUBLISHED, TaskState.ARCHIVED]}
              size="small"
              renderItem={item => (
                <List.Item
                  style={{ padding: '5px' }}
                  onClick={() => handleTaskStatusChange(data.id, item)}>
                  <Tag
                    color={item === state ? 'success' : 'default'}
                    icon={item === state ? <CheckCircleOutlined /> : <RightCircleOutlined />}
                    style={{ cursor: 'pointer' }}>
                    {item}
                  </Tag>
                </List.Item>
              )}
            />}
          trigger="click"
          visible={isVisiblePopover[data.id]}
          onVisibleChange={(visible: boolean): void => {
            handleVisiblePopover(visible, data.id)
          }}

        >
          <Tag color={state === 'DRAFT' ? 'volcano' : 'green'}>
            {state.toUpperCase()}
          </Tag>
        </Popover>

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
