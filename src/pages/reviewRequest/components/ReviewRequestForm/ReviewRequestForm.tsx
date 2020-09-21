import React, { useState, useEffect, FC } from 'react';
import { Button, Col, Form, Input, Row, Select, Alert, message } from 'antd';

import { urlWithIpPattern, githubPrUrl } from '../../../../services/validators';
import { ITask, IReviewRequest, ReviewRequestState, ITaskScore } from '../../../../models';

type ReviewRequestFormProps = {
  reviewRequests: Array<any>,
  user: string,
  tasks: Array<ITask>,
  isLoading: boolean,
  selfGrade: ITaskScore | null,
  submitHandlerAdd: (data: IReviewRequest) => void,
  submitHandlerUpdate: (data: IReviewRequest, id: string) => void,
  selfGradeTogle: (data: ITaskScore | null) => void,
}

export const ReviewRequestForm: React.FC<ReviewRequestFormProps> = (props) => {

  const { reviewRequests, user, tasks, isLoading, selfGrade, submitHandlerAdd, submitHandlerUpdate, selfGradeTogle } = props;

  const [form] = Form.useForm();
  const [submittedRequest, setSubmittedRequest] = useState(true as IReviewRequest | undefined | boolean);
  const [taskId, setTaskId] = useState(null as string | null);

  useEffect(() => {
    form.resetFields();
    setSubmittedRequest(true);
  }, [form, reviewRequests])

  type formValues = {
    taskId: string,
    url: string,
    urlPR: string,
    status: ReviewRequestState,
  }

  const handleSubmit = async (values: formValues) => {
    if (!taskId) {
      return;
    }
    try {
      const data: IReviewRequest = {
        id: submittedRequest && typeof submittedRequest !== 'boolean' ? submittedRequest.id : Date.now().toString(),
        crossCheckSessionId: null,
        author: user,
        task: taskId,
        state: values.status,
        url: values.url,
        urlPR: values.urlPR,
        selfGrade: selfGrade,
      }
      if (submittedRequest && typeof submittedRequest !== 'boolean') {
        submitHandlerUpdate(data, submittedRequest.id);
      } else {
        submitHandlerAdd(data);
      }
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
    const submittedRequest = reviewRequests.find((request: IReviewRequest) => request.task === taskId);
    setSubmittedRequest(submittedRequest);
    selfGradeTogle(submittedRequest ? submittedRequest.selfGrade : null)
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
          {renderSelfGradeStatus(submittedRequest)}
          {renderInputs(submittedRequest)}
        </Form>
      </Col>
    </Row>
  );

  function renderRevRequestStatus(submittedRequest: IReviewRequest | undefined | boolean) {
    if (submittedRequest && typeof submittedRequest !== 'boolean') {
      switch (submittedRequest.state) {
        case 'PUBLISHED':
          return (
            <Alert
              message={
                <>
                  <span>Review request has been submitted</span>
                  <a target="_blank" rel="noopener noreferrer" href={submittedRequest.url}>
                    {submittedRequest.url}
                  </a>{' '}
                </>
              }
              type="success"
              showIcon
            />);
        case 'COMPLETED':
          return (
            <Alert
              message={
                <span>Review request has been completed</span>
              }
              type="info"
              showIcon
            />);
        default:
          return null
      }
    }
  }

  function renderInputs(submittedRequest: IReviewRequest | undefined | boolean) {
    if (typeof submittedRequest !== 'boolean' && selfGrade) {
      return !submittedRequest || submittedRequest.state === 'DRAFT' ? (
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
          <Form.Item name="status" label="Request status" rules={[{ required: true, message: 'Please select request status' }]}>
            <Select placeholder={'Select request status'}  >
              <Select.Option value={ReviewRequestState.DRAFT}>
                {ReviewRequestState.DRAFT}
              </Select.Option>
              <Select.Option value={ReviewRequestState.PUBLISHED}>
                {ReviewRequestState.PUBLISHED}
              </Select.Option>
              <Select.Option value={ReviewRequestState.COMPLETED}>
                {ReviewRequestState.COMPLETED}
              </Select.Option>
            </Select>
          </Form.Item>
          <Button style={{ marginTop: 16, marginRight: 16 }} type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={() => form.resetFields()}>
            Reset
          </Button>
        </>
      ) : null;
    }
  }

  function renderSelfGradeStatus(submittedRequest: IReviewRequest | undefined | boolean) {
    if (typeof submittedRequest !== 'boolean' && !selfGrade) {
      return !submittedRequest ? (
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
          <Button style={{ marginTop: 16 }} htmlType="button" onClick={() => selfGradeTogle(null)}>
            Open self-check form
          </Button>
        </>
      ) : null;
    }
  }
}
