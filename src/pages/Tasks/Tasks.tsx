/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import role from './constants';
import './Tasks.scss';
import { Table, Tag, Space, Input } from 'antd';
import { getTasks } from '../../services/heroku'; 

const Action: React.FC= () => {
  if(role === 'student'){
    return(
    <Space size="middle">
      <a>Details</a>
    </Space>
  )} else {
    return(
    <Space size="middle">
      <a>Edit</a>
      <a>Delete</a>
    </Space>
    )
  }
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
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
    key: 'tags',
    dataIndex: 'tags',
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

const data = [
  {
    key: '1',
    name: 'Songbird',
    deadline: '01.09.2020',
    author: 'yuliahope',
    tags: ['PUBLISHED'],
    comment: '',
  },
  {
    key: '2',
    name: 'X Check App',
    deadline: '22.09.2020',
    author: 'yuliahope',
    tags: ['DRAFT'],
    comment: '',
  },
  {
    key: '3',
    name: 'New Task',
    deadline: '--.--.----',
    author: 'yuliahope',
    tags: ['ARCHIVED'],
    comment: '',
  },
];

export const Tasks: React.FC= () => {
  const [backData, setBackData] = useState(data);
  useEffect(() => {
    const fetchData = async() => {
      const value = await getTasks();
      setBackData(value);
    }
    fetchData();
  },[]);
  return (
    <Table columns={columns} dataSource={backData} />
  )
}
  
export default Tasks;
