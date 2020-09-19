import React from 'react';
import { Select } from 'antd';
import { IReviewRequest } from '../../../../models';
const { Option } = Select;

function onChange(value: any) {
  console.log(`selected ${value}`);
}

function onBlur() {
  console.log('blur');
}

function onFocus() {
  console.log('focus');
}

function onSearch(val: String) {
  console.log('search:', val);
}

interface IRequestSelectorProps {
  requests: IReviewRequest[];
}

export const RequestSelector = (props: IRequestSelectorProps) => {
  const { requests } = props;
  return (
    <Select
      showSearch
      style={{ width: 200 }}
      placeholder="Select a person"
      optionFilterProp="children"
      onFocus={onFocus}
      onBlur={onBlur}
      onSearch={onSearch}
      onChange={onChange}
      filterOption={(input, option) =>
        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {requests.map((item) => (
        <Option key={item.id} value={item.id}>{`${item.task} - ${item.author}`}</Option>
      ))}
    </Select>
  );
};
