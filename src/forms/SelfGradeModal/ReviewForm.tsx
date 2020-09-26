import React from 'react';
import { IReviewRequest, ITask } from '../../models';
import { Button, Descriptions, Form, Input, InputNumber, Space } from 'antd';
interface IReviewForm {
  reviewRequest: IReviewRequest | null;
  task: ITask | undefined;
}
const onFinish = (values: string) => {
  console.log('Received values of form:', values);
};
export const ReviewForm = (props: IReviewForm) => {
  const { reviewRequest, task } = props;
  return (
    <Form size={'small'} name="dynamic_form_item" onFinish={onFinish}>
      {reviewRequest?.selfGrade?.items.map((item) => (
        <Form.Item>
          <Descriptions>
            <Descriptions.Item>{item.id}</Descriptions.Item>
            <Descriptions.Item>{item.score}</Descriptions.Item>
          </Descriptions>
        </Form.Item>
      ))}
      <Form.Item>
        <Space size={'middle'} align={'center'}>
          <Button type="primary" htmlType="submit">
            Save and close
          </Button>
          <Button type="primary" htmlType="submit">
            Publish
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
