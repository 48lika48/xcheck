import React from 'react';
import { Table, Spin, Button } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';

type UserRequestListProps = {
  reviewRequests: Array<Object>,
  user: string,
  deleteHandler: (requestId: string) => void
}

export const ReviewRequestList: React.FC<UserRequestListProps> = ({ reviewRequests, user, deleteHandler }) => {

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Task',
      dataIndex: 'task',
      key: 'task',
      render: (text: string) => <span>{text}</span>,
      sorter: (a: any, b: any) => a.task - b.task,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a: any, b: any) => a.status - b.status,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: (text: string) => <a target="_blank" rel="noopener noreferrer" href={text}>{text}</a>,
    },
    {
      title: 'Pull Request URL',
      dataIndex: 'urlPR',
      key: 'urlPR',
      render: (text: string) => <a target="_blank" rel="noopener noreferrer" href={text}>{text}</a>,
    },
    {
      title: 'Self-check',
      dataIndex: 'sefCheck',
      key: 'sefCheck',
      render: () => (
        <Button type="primary" ghost onClick={() => console.log('Show self-check modal')}>
          Show self-check result
        </Button>
      ),
    },
    {
      title: 'Review',
      dataIndex: 'review',
      key: 'review',
      render: () => (
        <Button type="primary" ghost onClick={() => console.log('Show review results')}>
          Show review results
        </Button>
      ),
    },
    {
      title: 'Delete',
      key: 'action',
      render: (text: string, record: any) => (
        <Button shape="circle" icon={<DeleteOutlined />} onClick={() => deleteHandler(record.id)}/>
      ),
    },
  ];

  const data = reviewRequests
    .filter((req: any) => req.author === user || req.author === 'someauthor')  /*  ToDo: remove req.author === 'someauthor' */
    .map((req: any, index: number) => {
      return {
        key: index.toString(),
        id: req.id,
        task: req.task,
        status: req.state,
        sefCheck: req.state,
        url: req.url,
        urlPR: req.urlPR,
      }
  })

  return reviewRequests.length ? <Table columns={columns} dataSource={data} style={{marginTop: '20px'}} /> : <Spin />
}
