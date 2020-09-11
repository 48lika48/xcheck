import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';

import { urlWithIpPattern, githubPrUrl } from '../../services/validators';

interface ITask {
  id: string;
  author: string;
  state: string;
}

export const ReviewRequestForm: React.FC = () => {
  const [form] = Form.useForm();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTasks = async () => {
      const response = await fetch('https://xcheck-db-project.herokuapp.com/tasks');
      const data = await response.json();
      setTasks(data)
      setIsLoading(false)
    }
    getTasks()
  })

  return (
    <Row gutter={24}>
      <Col>
        <Form form={form} layout="vertical">
          <Form.Item name="courseTaskId" label="Task" rules={[{ required: true, message: 'Please select a task' }]}>
            <Select placeholder={isLoading ? 'Loading...' : 'Select task'} >
              {tasks.map((task) => {
                return (                  
                  <Select.Option value={task.id}>
                    {task.id}
                  </Select.Option>
                )
              })}
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
            <Button htmlType="button" onClick={() => form.resetFields()}>
              Reset
            </Button>
        </Form>
      </Col>
    </Row>
  );
}
