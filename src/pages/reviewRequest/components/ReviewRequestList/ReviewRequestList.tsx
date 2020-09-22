import React from 'react';
import { Table, Button, Tag } from 'antd';
import { FileDoneOutlined } from '@ant-design/icons';
import { IReview, IReviewRequest } from '../../../../models';

import { DeleteOutlined } from '@ant-design/icons';

type UserRequestListProps = {
  reviewRequests: Array<IReviewRequest>,
  reviews: Array<IReview>,
  user: string,
  deleteHandler: (requestId: string) => void,
  isLoading: boolean,
}

export const ReviewRequestList: React.FC<UserRequestListProps> = ({ reviewRequests, reviews, user, deleteHandler, isLoading }) => {

  const expandedRowRender = (record: any) => {
    const columns = [
      {
        title: 'Reviewer',
        dataIndex: 'reviewer',
        align: 'center' as 'center',
        key: 'reviewer',
      },
      {
        title: 'Review status',
        dataIndex: 'reviewState',
        align: 'center' as 'center',
        key: 'reviewState',
        render: (reviewState: string) => {
          const getStatus = () => {
            switch(reviewState.toUpperCase()) {
              case 'DRAFT':
                return 'magenta';
              case 'PUBLISHED':
                return 'blue';
              case 'DISPUTED':
                return 'orange';
              case 'ACCEPTED':
                return 'green';
              case 'REJECTED':
                return 'volcano';
              default:
                return
            }
          }
        return (
          <Tag color={getStatus()}>{reviewState}</Tag>
        )}
      },
      {
        title: 'Grade',
        dataIndex: 'grade',
        align: 'center' as 'center',
        key: 'grade',
      },
      {
        title: 'Review details',
        dataIndex: 'reviewDetails',
        align: 'center' as 'center',
        key: 'reviewDetails',
        render: () => (
          <Button shape="circle" icon={<FileDoneOutlined />} onClick={() => console.log('Show review details')} />
        )
      },
    ];

    const expandedData = reviews
      .filter((review: IReview) => review.requestId === record.id)
      .map((review: IReview, index: number) => {
        return {
          key: index.toString(),
          reviewer: review.author,
          reviewState: review.state,
          grade: 600, //ToDO total grade
        }
      })
    return <Table columns={columns} dataSource={expandedData} pagination={false} />;
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      align: 'center' as 'center',
      key: 'id',
    },
    {
      title: 'Task',
      dataIndex: 'task',
      align: 'center' as 'center',
      key: 'task',
      sorter: (a: any, b: any) => a.task - b.task,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center' as 'center',
      key: 'status',
      sorter: (a: any, b: any) => a.status - b.status,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      align: 'center' as 'center',
      key: 'url',
      render: (text: string) => <a target="_blank" rel="noopener noreferrer" href={text}>{text}</a>,
    },
    {
      title: 'Pull Request URL',
      dataIndex: 'urlPR',
      align: 'center' as 'center',
      key: 'urlPR',
      render: (text: string) => <a target="_blank" rel="noopener noreferrer" href={text}>{text}</a>,
    },
    {
      title: 'Self-check details',
      dataIndex: 'selfCheck',
      align: 'center' as 'center',
      key: 'selfCheck',
      render: () => (
        <Button shape="circle" icon={<FileDoneOutlined />} onClick={() => console.log('Show review details')} />
      ),
    },
    {
      title: 'Delete',
      key: 'action',
      align: 'center' as 'center',
      render: (text: string, record: any) => (
        <Button shape="circle" icon={<DeleteOutlined />} onClick={() => deleteHandler(record.id)}/>
      ),
    },
  ];

  const data = reviewRequests
  .filter((req: IReviewRequest) => req.author === user)
  .map((req: IReviewRequest, index: number) => {
    return {
      key: index.toString(),
      id: req.id,
      task: req.task,
      status: req.state,
      selfCheck: req.state,
      url: req.url,
      urlPR: req.urlPR,
    }
  })

  return <Table
    loading={isLoading}
    columns={columns}
    dataSource={data}
    style={{marginTop: '20px'}}
    expandable={{ expandedRowRender }}
    pagination={false}
  />
}
