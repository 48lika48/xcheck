import React from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Space,
  Checkbox,
  Tooltip,
} from 'antd';
import { formItemLayout } from '../../../../forms/task-manager/constants/constants';
import CheckBox from 'rc-checkbox';
const { RangePicker } = DatePicker;

interface ICrossSessionForm {
  id: string;
}
export const CrossSessionForm = (props: ICrossSessionForm) => {
  const { id } = props;
  const onFinish = (values: any) => {
    console.log(values);
  };
  return (
    <Form
      id={id}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      initialValues={{ size: 'default' }}
      onFinish={onFinish}
    >
      <Form.Item
        label="Session name"
        name="id"
        rules={[{ required: true, message: 'Please input session name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Task name"
        name="taskId"
        rules={[{ required: true, message: 'Please select task' }]}
      >
        <Select>
          <Select.Option value="demo">Demo</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Score coefficient" name="coefficient" initialValue={1}>
        <InputNumber min={0.1} max={1} step={0.1} />
      </Form.Item>
      <Form.Item label="Reviewers amount:" name="desiredReviewersAmount" initialValue={1}>
        <InputNumber min={1} max={5} />
      </Form.Item>
      <Form.Item
        label="Date range:"
        {...formItemLayout}
        rules={[{ required: true, message: 'Please input dates!' }]}
      >
        <Space direction="vertical" size={12}>
          <RangePicker />
        </Space>
      </Form.Item>
      <Form.Item>
        <Tooltip
          title="Ignore the review with minimal score when calculating average"
          placement="topLeft"
        >
          <Form.Item
            name="discardMinScore"
            valuePropName="checked"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <Checkbox> Min score</Checkbox>
          </Form.Item>
        </Tooltip>

        <Tooltip
          title="Ignore the review with maximal score when calculating average"
          placement="topLeft"
        >
          <Form.Item
            name="discardMaxScore"
            valuePropName="checked"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <Checkbox> Max score</Checkbox>
          </Form.Item>
        </Tooltip>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};
