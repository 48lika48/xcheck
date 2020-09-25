/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { Table, Tag, Space, Spin, Button, Badge, Tooltip } from 'antd';
import './Review.scss';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import {
  fetchRequestsToReview,
  fetchReviewsByAuthor,
  fetchReviewsRequests,
} from '../../store/reducers/reviewsPageSlice';
import { ReloadOutlined } from '@ant-design/icons';
import { RequestSelector } from './components/requestSelector';

export const ReviewPage: React.FC = () => {
  const dispatch = useDispatch();
  const { taskLoading, reviews, requests, error, requestsForReview } = useSelector(
    (state: RootState) => state.reviewsPage
  );
  const getData = useCallback(() => {
    dispatch(fetchReviewsByAuthor());
    dispatch(fetchReviewsRequests());
    dispatch(fetchRequestsToReview());
  }, [dispatch]);
  useEffect(() => {
    getData();
  }, [dispatch, getData]);
  const columns = [
    {
      title: 'Reviewed Student',
      dataIndex: 'reviewedStudent',
      sorter: (a: { reviewedStudent: string | any[] }, b: { reviewedStudent: string | any[] }) =>
        a.reviewedStudent.length - b.reviewedStudent.length,
    },
    {
      title: 'Task',
      dataIndex: 'task',
      sorter: (a: { task: string | any[] }, b: { task: string | any[] }) =>
        a.task.length - b.task.length,
    },
    {
      title: 'Status',
      dataIndex: 'state',
      render: function (state: any) {
        const getColor = (state: string) => {
          switch (state.toUpperCase()) {
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
          }
        };
        return <Tag color={getColor(state)}>{state.toUpperCase()}</Tag>;
      },
      filters: [
        {
          text: 'DRAFT',
          value: 'DRAFT',
        },
        {
          text: 'PUBLISHED',
          value: 'PUBLISHED',
        },
        {
          text: 'DISPUTED',
          value: 'DISPUTED',
        },
        {
          text: 'ACCEPTED',
          value: 'ACCEPTED',
        },
        {
          text: 'REJECTED',
          value: 'REJECTED',
        },
      ],
      onFilter: (value: any, record: { state: string | any[] }) =>
        record.state.indexOf(value) === 0,
    },
    {
      title: 'Action',
      render: (text: String, record: any) => (
        <Space size="middle">
          <Button href="#" onClick={() => console.log(record.id)}>
            Open
          </Button>
          {record.state === 'DISPUTED' && (
            <Button href="#" onClick={() => console.log('dispute')}>
              Dispute
            </Button>
          )}
        </Space>
      ),
    },
  ];
  return (
    <Spin spinning={taskLoading}>
      <Space size="middle">
        <Badge count={requests.length}>
          <Tooltip placement="topLeft" title={`You can create ${requests.length} more reviews`}>
            <RequestSelector requests={requestsForReview} />
          </Tooltip>
        </Badge>
      </Space>
      {error && <h1>{`Error: ${error}`}</h1>}
      <Table columns={columns} dataSource={reviews} rowKey="id" />
      <Button onClick={() => getData()} icon={<ReloadOutlined />}>
        Reload
      </Button>
    </Spin>
  );
};
// TODO add user role behavior
