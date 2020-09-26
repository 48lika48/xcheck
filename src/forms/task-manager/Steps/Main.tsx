import * as React from 'react';
import moment from 'moment';
import { Form, Button, Input, Space, DatePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { formItemLayout, formItemLayoutWithOutLabel } from '../constants/constants';
import { updateArray } from './helpers';
import { ITask } from 'src/models';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

type MainProps = {
  onDataChange: (field: string, value: string | string[]) => void;
  taskData: ITask
}

const Main: React.FC<MainProps> = ({ onDataChange, taskData }) => {
  return (
    <Form name="dynamic_form_item" {...formItemLayoutWithOutLabel} >
      <Form.Item
        label="Task name"
        {...formItemLayout}
        rules={[{ required: true, message: 'Please input task name!' }]}
        initialValue={taskData.id}
      >
        <Input
          placeholder="task name"
          style={{ width: '60%' }}
          value={taskData.id}
          onChange={
            (e: React.FormEvent<HTMLInputElement>) => onDataChange('id', e.currentTarget.value)}
        />
      </Form.Item>
      <Form.Item
        label="Short description"
        {...formItemLayout}
        rules={[{ required: true, message: 'Please input short description!' }]}
        initialValue={taskData.description}
      >
        <TextArea
          placeholder="short description"
          style={{ width: '60%' }}
          autoSize
          value={taskData.description}
          onChange={
            (e: React.ChangeEvent<HTMLTextAreaElement>) => onDataChange('description', e.currentTarget.value)}
        />
      </Form.Item>
      <Form.Item
        label="Date range:"
        {...formItemLayout}
        rules={[{ required: true, message: 'Please input dates!' }]}
      >
        <Space direction="vertical" size={12} >
          <RangePicker
            ranges={{}}
            value={[moment(taskData.startDate), moment(taskData.endDate)]}
            showTime
            format="DD.MM.YYYY HH:mm"
            onChange={
              (values: any) => {
                if (values) {
                  onDataChange('startDate', values[0].format());
                  onDataChange('endDate', values[1].format());
                }
              }
            }
          />
        </Space>
      </Form.Item>
      <Form.List name="tasks" >
        {(fields, { add, remove }) => {
          taskData.goals && fields.length === 0 && fields.push(...taskData.goals.map((item: string, index: number) => {
            return {
              fieldKey: index,
              isListField: true,
              key: index,
              name: index,
            }
          }));
          return (
            <div>
              {fields.map((field, index) => (
                <Form.Item
                  {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                  label={index === 0 ? 'Task goals' : ''}
                  required={false}
                  key={field.key}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Please input task goal or delete this field.",
                      },
                    ]}
                    initialValue={taskData.goals && taskData.goals[index]}
                    noStyle
                  >
                    <TextArea
                      placeholder="task goal"
                      style={{ width: '60%' }}
                      autoSize
                      onChange={
                        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          onDataChange('goals', updateArray(taskData.goals || [], index, e.currentTarget.value))
                        }
                      }
                      value={taskData.goals && taskData.goals[index]}
                    />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      style={{ margin: '0 8px' }}
                      onClick={() => {
                        remove(field.name);
                        updateArray(taskData.goals || [], index, '')
                      }}
                    />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '60%' }}
                >
                  <PlusOutlined /> Add goal
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>
    </Form>
  );
}
export default Main;
