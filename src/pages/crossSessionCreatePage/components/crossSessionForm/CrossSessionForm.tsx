import React from 'react';
import { Form, Button, Select, DatePicker, InputNumber, Space, Checkbox, Tooltip } from 'antd';
import { ICheckSession, ITask } from '../../../../models';
import moment from 'moment';
const { RangePicker } = DatePicker;
const tailLayout = {
  wrapperCol: { offset: 5, span: 16 },
};
interface ICrossSessionForm {
  id: string;
  tasks: ITask[];
  isEdit: boolean;
  editData: any;
  onSave: (value: ICheckSession) => void;
}
export const CrossSessionForm = (props: ICrossSessionForm) => {
  const { id, tasks, isEdit, editData, onSave } = props;
  let startData = '';
  let endData = '';
  const onFinish = (values: any) => {
    values.startDate = startData;
    values.endDate = endData;
    values.id = isEdit ? editData.id : `${values.taskId}-crossCheck`;
    values.state = isEdit ? editData.state : `DRAFT`;
    onSave(values);
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
        label="Task name"
        name="taskId"
        rules={[{ required: !isEdit, message: 'Please select task' }]}
        initialValue={isEdit ? editData.taskId : ''}
      >
        <Select placeholder={'Select task first...'} disabled={isEdit}>
          {tasks.length > 0 &&
            tasks.map((item) => <Select.Option value={item.id}>{item.id}</Select.Option>)}
        </Select>
      </Form.Item>

      <Form.Item
        label="Score coefficient"
        name="coefficient"
        initialValue={isEdit ? editData.coefficient : 1}
      >
        <InputNumber min={0.1} max={1} step={0.1} />
      </Form.Item>

      <Form.Item
        label="Reviewers amount:"
        name="desiredReviewersAmount"
        initialValue={isEdit ? editData.desiredReviewersAmount : 2}
      >
        <InputNumber min={1} max={5} />
      </Form.Item>

      <Form.Item label="Date range:" rules={[{ required: true, message: 'Please input dates!' }]}>
        <Space direction="vertical" size={12}>
          <RangePicker
            ranges={{}}
            defaultValue={isEdit ? [moment(editData.startDate), moment(editData.endDate)] : null}
            showTime
            format="DD.MM.YYYY HH:mm"
            onChange={(values: any) => {
              if (values) {
                startData = values[0].format();
                endData = values[1].format();
              }
            }}
          />
        </Space>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Tooltip
          title="Ignore the review with minimal score when calculating average"
          placement="topLeft"
        >
          <Form.Item
            name="discardMinScore"
            valuePropName="checked"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <Checkbox defaultChecked={isEdit ? editData.discardMinScore : false}>
              Discard min score
            </Checkbox>
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
            <Checkbox defaultChecked={isEdit ? editData.discardMaxScore : false}>
              Discard max score
            </Checkbox>
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
