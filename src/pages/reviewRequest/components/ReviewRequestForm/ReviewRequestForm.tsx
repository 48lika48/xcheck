import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Select, Alert, message } from 'antd';

import { urlWithIpPattern, githubPrUrl } from '../../../../services/validators';
import { ITask, IReviewRequest, ReviewRequestState } from '../../../../models';
import { addReviewRequest } from '../../../../services/heroku';

type ReviewRequestFormProps = {
  reviewRequests: Array<any>,
  user: string,
  tasks: Array<ITask>,
  isLoading: boolean
}

export const ReviewRequestForm: React.FC<ReviewRequestFormProps> = ({ reviewRequests, user, tasks, isLoading }) => {

  const [form] = Form.useForm();
  const [submittedRequest, setSubmittedRequest] = useState(null as IReviewRequest | null);
  const [isSelfGradeDone, setIsSelfGradeDone] = useState(null as boolean | null);
  const [taskId, setTaskId] = useState(null as string | null);

  const handleSubmit = async (values: {taskId: string, url: string, urlPR: string}) => {
    if (!taskId) {
      return;
    }
    try {
      const data: IReviewRequest = {
        id: Date.now().toString(),
        crossCheckSessionId: null,
        author: user,
        task: taskId,
        state: ReviewRequestState.PUBLISHED,
        url: values.url,
        urlPR: values.urlPR,
        selfGrade: {}
      }
      await addReviewRequest(data);
      message.success('The task solution has been submitted');
      form.resetFields();
    } catch (e) {
      message.error('An error occured. Please try later.');
    }
  };

  const handleTaskChange = async (value: string) => {
    const taskId = value;
    const task = tasks.find(t => t.id === taskId);
    if (task == null) {
      return;
    }
    const submittedRequest = reviewRequests.find((request: IReviewRequest) => request.task === taskId) || null
    const isSelfGradeDone = submittedRequest ? Object.keys(submittedRequest.selfGrade).length !== 0 : false;
    setSubmittedRequest(submittedRequest);
    setIsSelfGradeDone(isSelfGradeDone);
    setTaskId(task.id)
  };

  return (
    <Row gutter={24}>
      <Col>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="taskId" label="Task" rules={[{ required: true, message: 'Please select a task' }]}>
            <Select placeholder={isLoading ? 'Loading...' : 'Select task'} onChange={handleTaskChange} >
              {tasks.filter((task) => task.state.toUpperCase() === 'PUBLISHED').map((task) => {
                return (
                  <Select.Option value={task.id} key={task.id}>
                    {task.id}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
          {renderRevRequestStatus(submittedRequest)}
          {renderSelfGradeStatus(isSelfGradeDone, submittedRequest)}
          {isSelfGradeDone && (
            <>
              <Form.Item
                name="url"
                label="Solution URL"
                rules={[{ required: true, pattern: urlWithIpPattern, message: 'Please provide a valid link' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="urlPR"
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
            </>
          )}

        </Form>
      </Col>
    </Row>
  );

  function renderRevRequestStatus(submittedRequest: IReviewRequest | null) {
    return submittedRequest ? (
      <Alert
        message={
          <>
            Submitted {submittedRequest.task}
            {/* <a target="_blank" href={submittedRequest.task}>
              {submittedRequest.task}
            </a>{' '}.   ToDo  */}
          </>
        }
        type="success"
        showIcon
      />
    ) : null;
  }

  function renderSelfGradeStatus(isSelfGradeDone: boolean | null, submittedSolution: IReviewRequest | null) {
    return isSelfGradeDone === false && !submittedSolution ? (
      <>
        <Alert
          message={
            <>
              Let's do a self-test before proceeding.
            </>
          }
          type="warning"
          showIcon
        />
        <Button style={{ marginTop: 16 }} htmlType="button" onClick={() => setIsSelfGradeDone(true)}>
          Open self-check form
        </Button>
      </>
    ) : null;
  }
}
