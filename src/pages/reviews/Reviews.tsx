import * as React from 'react';
import { Table, Tag, Space, Spin, Button, Badge, Tooltip } from 'antd';
import './Review.scss';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { fetchRequestsToReview, fetchReviewsByAuthor } from '../../store/reducers/reviewsPageSlice';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';

export const ReviewPage: React.FC = () => {
  const dispatch = useDispatch();
  const { taskLoading, reviews, requests, error } = useSelector(
    (state: RootState) => state.reviewsPage
  );
  const getData = useCallback(() => {
    dispatch(fetchReviewsByAuthor());
    dispatch(fetchRequestsToReview());
  }, [dispatch]);
  useEffect(() => {
    getData();
  }, [dispatch, getData]);
  const columns = [
    {
      title: 'Reviewed Student',
      dataIndex: 'reviewedStudent',
    },
    {
      title: 'Task',
      dataIndex: 'task',
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
            <Button
              onClick={() => console.log('add')}
              type="primary"
              style={{
                marginBottom: 16,
              }}
              icon={<PlusOutlined />}
            >
              Add a review
            </Button>
          </Tooltip>
        </Badge>
        <Button
          onClick={() => getData()}
          style={{
            marginBottom: 16,
          }}
          icon={<ReloadOutlined />}
        >
          Refresh
        </Button>
      </Space>
      {error && <h1>{`Error: ${error}`}</h1>}
      <Table columns={columns} dataSource={reviews} rowKey="id" />
    </Spin>
  );
};
