import React from 'react';
import { Table } from 'antd';

export const ReviewRequestList: React.FC = () => {

  const columns = [
    {
      title: 'Task',
      dataIndex: 'task',
      key: 'task',
      render: (text: string) => <span>{text}</span>,
      sorter: (a: any, b: any) => a.task - b.task,
    },
    {
      title: 'Student',
      dataIndex: 'student',
      key: 'student',
      sorter: (a: any, b: any) => a.student - b.student,
    },
    {
      title: 'GitHub',
      dataIndex: 'github',
      key: 'github',
      sorter: (a: any, b: any) => a.github - b.github,
    },  
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'sstatus',
      sorter: (a: any, b: any) => a.status - b.status,
    },
  ];
  
  const data = [
    {
      key: '1',
      task: 'simple-task-v1',
      student: 'Maksim Dziubo',
      github: 'MaksimDiubo',
      status: 'pablished',
    },
    {
      key: '2',
      task: 'xcheck',
      student: 'Maksim Dziubo',
      github: 'MaksimDiubo',
      status: 'draft',
    },
  ];

  return (
    <Table columns={columns} dataSource={data} style={{marginTop: '20px'}} />
  );
}
