import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Input, Row, Select, Alert } from 'antd';

import { urlWithIpPattern, githubPrUrl } from '../../services/validators';
import { ITask, IReviewRequest } from '../../models';
import { getReviewRequest } from '../../services/rev-req';

export const ReviewRequestForm: React.FC = () => {

  const [form] = Form.useForm();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submittedRequest, setSubmittedRequest] = useState(null as IReviewRequest | null);
  const [isSelfGradeDone, setIsSelfGradeDone] = useState(null as boolean | null);

  useEffect(() => {
    const getTasks = async () => {
      const response = await fetch('https://xcheck-db-project.herokuapp.com/tasks');
      const data = await response.json();
      setTasks(data)
      setIsLoading(false)
    }
    getTasks()
  }, [])

  // const handleSubmit = async (values: any) => {
  //   if (!courseTaskId) {
  //     return;
  //   }
  //   try {
  //     await courseService.postTaskSolution(props.session.githubId, courseTaskId, values.url);
  //     message.success('The task solution has been submitted');
  //     form.resetFields();
  //   } catch (e) {
  //     message.error('An error occured. Please try later.');
  //   }
  // };

  const handleTaskChange = async (value: string) => {
    const taskId = value;
    const task = tasks.find(t => t.id === taskId);
    if (task == null) {
      return;
    }
    const submittedRequest = await getReviewRequest(taskId);
    // const isSelfGradeDone = submittedRequest ? Object.keys(submittedRequest.selfGrade).length !== 0 : false;
    setSubmittedRequest(submittedRequest);
    setIsSelfGradeDone(true); /* ToDo */
  };

  return (
    <Row gutter={24}>
      <Col>
        <Form form={form} layout="vertical" >
          <Form.Item name="courseTaskId" label="Task" rules={[{ required: true, message: 'Please select a task' }]}>
            <Select placeholder={isLoading ? 'Loading...' : 'Select task'} onChange={handleTaskChange} >
              {tasks.map((task) => {
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
            </>
          )}

        </Form>
      </Col>
    </Row>
  );

  function renderRevRequestStatus(submittedSolution: IReviewRequest | null) {
    return submittedSolution ? (
      <Alert
        message={
          <>
            Submitted {submittedSolution.task}
            {/* <a target="_blank" href={submittedSolution.task}>
              {submittedSolution.task}
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
        <Button style={{ marginTop: 16 }} htmlType="button" onClick={() => console.log('Open self-check modal')}>
          Open self-check form
        </Button>
      </>
    ) : null;
  }
}
