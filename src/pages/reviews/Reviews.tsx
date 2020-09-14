import * as React from 'react';
import { Table, Tag, Space, Spin } from 'antd';
import { Select } from 'antd';
import { SelectValue } from 'antd/es/select';
import './Review.scss'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store/rootReducer';
import { fetchReviewsByAuthor } from '../../store/reducers/reviewsPageSlice';

const { Option } = Select;
function onChange(value: SelectValue) {
  console.log(`selected ${value}`);
}

function onBlur() {
  console.log('blur');
}

function onFocus() {
  console.log('focus');
}

function onSearch(val: SelectValue) {
  console.log('search:', val);
}

export const ReviewPage: React.FC = () => {
  const dispatch = useDispatch();
  const {taskLoading, dataLoading, reviews} = useSelector((state: RootState) => state.reviewsPage)
  useEffect(() => {
    dispatch(fetchReviewsByAuthor())
  }, []);

  const columns = [
    {
      title: 'Student',
      dataIndex: 'requestId',
      key: 'requestId',
      render(text:String) {
        return <a>{text}</a>;
      },
    },
    {
      title: 'Status',
      key: 'state',
      dataIndex: 'state',
      render(state:any) {
        return <Tag color={'blue'} key={state}>
          {state.toUpperCase()}
        </Tag>
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text:String, record:any) => (
        <Space size="small">
          <a>Open {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Spin spinning={taskLoading}>
        <Table columns={columns} dataSource={reviews} />
      </Spin>

    </div>
  );
}
