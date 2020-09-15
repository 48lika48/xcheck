import * as React from 'react';
import { Table, Tag, Space, Spin, Button } from 'antd';
import './Review.scss'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { fetchReviewsByAuthor } from '../../store/reducers/reviewsPageSlice';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';

export const ReviewPage: React.FC = () => {
  const dispatch = useDispatch();
  const {taskLoading, reviews} = useSelector((state: RootState) => state.reviewsPage)
  useEffect(() => {
    dispatch(fetchReviewsByAuthor())
  }, []);

  const columns = [
    {
      title: 'rev ID',
      dataIndex: 'id',
      key: 'id',
      render(text:String) {
        return <a>{text}</a>;
      },
    },
    {
      title: 'Reviewed Student',
      dataIndex: 'reviewedStudent',
      key: 'reviewedStudent',
      render(text:String) {
        return <a>{text}</a>;
      },
    },
    {
      title: 'Task',
      dataIndex: 'task',
      key: 'task'
    },
    {
      title: 'Status',
      key: 'state',
      dataIndex: 'state',
      render: function(state: any) {
        const getColor = (state: string) => {
          switch (state.toUpperCase()) {
            case 'DRAFT':
              return  'magenta';
            case 'PUBLISHED':
              return 'blue';
            case 'DISPUTED':
              return 'orange';
            case 'ACCEPTED':
              return 'green';
            case 'REJECTED':
              return 'volcano';
          }
        }
        return (<Tag color={getColor(state)} key={state}>
          {state.toUpperCase()}
        </Tag>);
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text:String, record:any) => (
        <Space size="middle">
          <a onClick={()=> console.log(record.id)}>Open</a>
          {record.state === 'DISPUTED' && <a onClick={()=> console.log('dispute')}>Dispute</a>}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Spin spinning={taskLoading}>
        <Space size='small'>
          <Button
            onClick={()=> console.log("add")}
            type="primary"
            style={{
              marginBottom: 16,
            }}
            icon={<PlusOutlined />}
          >
            Add a review
          </Button>
          <Button
            onClick={()=> console.log("refresh")}
            style={{
              marginBottom: 16,
            }}
            icon={<ReloadOutlined />}
          >
            Refresh
          </Button>
        </Space>
        <Table columns={columns} dataSource={reviews} />
      </Spin>
    </div>
  );
}
