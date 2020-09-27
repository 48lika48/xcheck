import React from 'react';
import { IReview, IReviewRequest, ITask, ITaskScoreItem, ReviewState } from '../../models';
import { Button, Descriptions, Divider, Form, InputNumber, Row, Space } from 'antd';
import TextArea from 'rc-textarea';
import { getGithubLogin } from '../../services/github-auth';
interface IReviewForm {
  reviewRequest: IReviewRequest | null;
  task: ITask | undefined;
  save: (result: any) => void;
}

export const ReviewForm = (props: IReviewForm) => {
  const { reviewRequest, task, save } = props;

  const subtasks = task?.subtasks;

  const onFinish = (values: any) => {
    let result: ITaskScoreItem[] = [];
    reviewRequest?.selfGrade?.items.map((item, index) => {
      result.push({
        subtask: '',
        score: values[`input-${index}`],
        comment: values[`comment-${index}`],
        id: item.id,
      });
    });
    let review: IReview = {
      author: getGithubLogin(),
      requestId: reviewRequest?.id ? reviewRequest?.id : 'id',
      id: `${reviewRequest?.id}-review`,
      state: ReviewState.PUBLISHED,
      task: task?.id,
      grade: { task: task?.id ? task?.id : 'task', items: result },
    };
    save(review);
  };
  return (
    <Form size={'small'} name="dynamic_form_item" onFinish={onFinish}>
      {reviewRequest?.selfGrade?.items.map((item, index) => (
        <Row key={`${item.id}-row`}>
          <Form.Item key={`${item.id}-desc`}>
            <Descriptions style={{ width: '100%' }} column={1}>
              <Descriptions.Item>{`${item.subtask}`}</Descriptions.Item>
              <Descriptions.Item>{`Результат самопроверки: ${item.score} из ${
                subtasks && task?.score
                  ? task?.score[`${item.id.split('_')[0]}`][
                      subtasks[`${item.id.split('_')[0]}`]?.indexOf(item.subtask)
                    ]
                  : undefined
              }`}</Descriptions.Item>
            </Descriptions>
          </Form.Item>
          <Space size={'small'}>
            <Form.Item
              label="score"
              key={`${item.id}-input`}
              name={`input-${index}`}
              rules={[{ required: true, message: 'Please input score' }]}
            >
              <InputNumber
                min={0}
                max={
                  subtasks && task?.score
                    ? task?.score[`${item.id.split('_')[0]}`][
                        subtasks[`${item.id.split('_')[0]}`]?.indexOf(item.subtask)
                      ]
                    : undefined
                }
              />
            </Form.Item>
            <Form.Item key={`${item.id}-comment`} name={`comment-${index}`} initialValue={''}>
              <TextArea rows={1} style={{ width: 300 }} />
            </Form.Item>
          </Space>
          <Divider />
        </Row>
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
