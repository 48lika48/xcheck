/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';

import { Table, Space, Input, Spin } from 'antd';
import { ITask } from 'src/models';

const columns = [
  {
    title: 'Name',
    dataIndex: 'id',
    key: 'id',
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: 'Deadline',
    dataIndex: 'deadline',
    key: 'deadline',
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
    // render: (tags: any) => (
    //   <>
    //     {tags.map((tag: any) => {
    //       let color = tag.length > 8 ? 'geekblue' : 'green';
    //       if (tag === 'DRAFT') {
    //         color = 'volcano';
    //       }
    //       return (
    //         <Tag color={color} key={tag}>
    //           {tag.toUpperCase()}
    //         </Tag>
    //       );
    //     })}
    //   </>
    // ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text: any, record: any) => (
      <Action />
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

  console.log(currentRole);

  if (currentRole === 'student') {
    return (
      <Space size="middle">
        <a>Details</a>
      </Space>
    )
  }

  return (
    <Space size="middle">
      <a>Edit</a>
      <a>Delete</a>
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
