import React from 'react';
import { Select } from 'antd';
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

export const RequestSelector: React.FC = () => {
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
      <Option value="jack">Jack</Option>
      <Option value="lucy">Lucy</Option>
      <Option value="tom">Tom</Option>
    </Select>
  );
};
