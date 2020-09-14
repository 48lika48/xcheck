import React from 'react';
import { Form, Button, Input, Space, Upload, DatePicker, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined, InboxOutlined } from '@ant-design/icons';
import moment from 'moment';
import { formItemLayout, formItemLayoutWithOutLabel } from '../constants/constants';
import { updateArray } from './helpers';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Dragger } = Upload;

const Main: React.FC<{ onDataChange: any; taskData: any }> = (props) => {
    const load = { 
      name: 'file',
      multiple: true,
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange(info: any) {
        const { status } = info.file;
        if (status !== 'uploading') {
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
          props.onDataChange('screenshot', info.file);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
  };

  return (
    <Form name="dynamic_form_item" {...formItemLayoutWithOutLabel} >
      <Form.Item
        label="Task name"
        {...formItemLayout}
        name="task-name"
        rules={[{ required: true, message: 'Please input task name!' }]}
      >
        <Input 
          placeholder="task name" 
          style={{ width: '60%' }}
          defaultValue={props.taskData.id}
          onChange={(value: any) => props.onDataChange('id', value.currentTarget.value)} />
      </Form.Item>
      <Form.Item
        label="Short description"
        {...formItemLayout}
        name="short-description"
        rules={[{ required: true, message: 'Please input short description!' }]}
      >
        <TextArea 
          placeholder="short description" 
          style={{ width: '60%' }} 
          autoSize
          defaultValue={props.taskData.description}
          onChange={(value: any) => props.onDataChange('description', value.currentTarget.value)} />
      </Form.Item>
      <Form.Item
        label="Task range:"
        {...formItemLayout}
        name="task-name"
        rules={[{ required: true, message: 'Please input task name!' }]}
      >
        <Space direction="vertical" size={12}>
          <RangePicker
            ranges={{
              Today: [moment(), moment()],
              'This Month': [moment().startOf('month'), moment().endOf('month')],
            }}
            defaultValue={
              [ props.taskData.startDate,  props.taskData.endDate]
            }
            showTime
            format="YYYY/MM/DD HH:mm:ss"
            onChange={(value: any) => {props.onDataChange('startDate', value[0]); props.onDataChange('startDate', value[1]) }}
          />
        </Space>,
      </Form.Item>
      <Form.List name="tasks">
        {(fields, { add, remove }) => {
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
                    noStyle
                  >
                    <TextArea 
                      placeholder="task goal" 
                      style={{ width: '60%' }} 
                      autoSize
                      onChange={(value: any) => {props.onDataChange('goals', updateArray(props.taskData.goals, index, value.currentTarget.value))}}
                      defaultValue={props.taskData.goals[index]}
                      />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      style={{ margin: '0 8px' }}
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  style={{ width: '60%' }}
                >
                  <PlusOutlined /> Add goal
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>
      <Form.Item
        label="Screenshot"
        {...formItemLayout}
        name="screenshot"
      >
        <Dragger {...load}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
            band files
            </p>
        </Dragger>,
      </Form.Item>
    </Form>
  );
}
export default Main;
