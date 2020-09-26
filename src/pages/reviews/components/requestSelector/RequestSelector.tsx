import React from 'react';
import { Select } from 'antd';
import { IReviewRequest } from '../../../../models';
const { Option } = Select;

interface IRequestSelectorProps {
  requests: IReviewRequest[];
  select: (value: string) => void;
  loading: boolean;
}

export const RequestSelector = (props: IRequestSelectorProps) => {
  const { requests, select, loading } = props;
  return (
    <Select
      loading={loading}
      style={{ width: 200, marginBottom: '1rem' }}
      placeholder="Select a request"
      optionFilterProp="children"
      onChange={select}
      disabled={requests.length === 0}
      filterOption={(input, option) =>
        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      allowClear
    >
      {requests.map((item) => (
        <Option key={item.id} value={item.id}>{`${item.task} - ${item.author}`}</Option>
      ))}
    </Select>
  );
};
//TODO Selector handlers
