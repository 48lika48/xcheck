import React from 'react';
import { useAsync } from 'react-use';
import { Button, Col, Form, Input, Row, Select } from 'antd';

import { urlWithIpPattern, githubPrUrl } from '../../services/validators';

export const ReviewRequestForm: React.FC = () => {
  const [form] = Form.useForm();
  
  const onReset = () => {
    form.resetFields();
  };

  const tasks = useAsync(async () => {
    const response = await fetch(`https://xcheck-db-project.herokuapp.com/tasks`);
    const result = await response.json();
    return result
  });

  console.log(tasks)

  return (
    <Row gutter={24}>
      <Col>
        <Form form={form} layout="vertical">
          <Form.Item name="courseTaskId" label="Task" rules={[{ required: true, message: 'Please select a task' }]}>
            <Select placeholder="Select task" >
              <Select.Option value='xcheck'>
                xcheck
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="url"
            label="Solution URL"
            rules={[{ required: true, pattern: urlWithIpPattern, message: 'Please provide a valid link' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="url"
            label="Pull request URL"
            rules={[{ required: true, pattern: githubPrUrl, message: 'Please provide a valid link' }]}
          >
            <Input />
          </Form.Item >
            <Button style={{ marginTop: 16, marginRight: 16 }} type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
        </Form>
      </Col>
    </Row>
  );
}
