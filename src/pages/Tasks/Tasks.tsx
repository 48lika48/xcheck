import React, { useState } from 'react';
import './Tasks.scss';
// import { Button } from 'antd';

import { Table, Tag, Space } from 'antd';

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
    title: 'Creator',
    dataIndex: 'creator',
    key: 'creator',
  },
  {
    title: 'Type',
    key: 'tags',
    dataIndex: 'tags',
    render: (tags: any) => (
      <>
        {tags.map((tag: any) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text: any, record: any) => (
      <Space size="middle">
        <a>Details {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
  {
    title: 'Comment',
    dataIndex: 'comment',
    key: 'comment',
  },
];

const data = [
  {
    key: '1',
    name: 'Songbird',
    deadline: '01.09.2020',
    creator: 'yuliahope',
    tags: ['js', 'react'],
    comment: '',
  },
  {
    key: '2',
    name: 'X Check App',
    deadline: '22.09.2020',
    creator: 'yuliahope',
    tags: ['loser'],
    comment: '',
  },
];

class Tasks extends React.Component {
  
  render() {
    
    return (
      <Table columns={columns} dataSource={data} />
    );
  }
}
  
export default Tasks;
