import * as React from 'react';
import { Form, Button, Input, Space, Upload, DatePicker, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { formItemLayout, formItemLayoutWithOutLabel } from '../constants/constants';
import { updateArray } from './helpers';
import { parsTask } from 'src/services/taskparser';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

type MainProps = {
  onDataChange: (field: string, value: any) => void;
  taskData: any
}

const Main: React.FC<MainProps> = ({ onDataChange, taskData }) => {
  let [fileList, setFileList] = React.useState();
  const load: any = {
    name: 'file',
    accept: '.json, .md',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    disabled: false,
    fileList: [],
    onChange: async (info: any) => {
      setFileList([info.file] as any);
      const { status } = info.file;
      if (status !== 'uploading') {
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 5,
      format: (percent: number) => `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  return (
    <Form name="dynamic_form_item" {...formItemLayoutWithOutLabel} >
      <Form.Item
        label="Task name"
        {...formItemLayout}
        rules={[{ required: true, message: 'Please input task name!' }]}
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
        label="Task range:"
        {...formItemLayout}
        rules={[{ required: true, message: 'Please input task name!' }]}
      >
        <Space direction="vertical" size={12} >
          <RangePicker
            name="range-time"
            ranges={{
              Today: [moment(), moment()],
              'This Month': [moment().startOf('month'), moment().endOf('month')],
            }}
            defaultValue={
              [taskData.startDate, taskData.endDate]
            }
            showTime
            format="YYYY/MM/DD HH:mm:ss"
            onChange={(values: any) => { values && onDataChange('startDate', values[0]); values && onDataChange('endDate', values[1]) }}
          />
        </Space>,
      </Form.Item>
      <Form.List name="tasks" >
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
                      onChange={(value: any) => { onDataChange('goals', updateArray(taskData.goals, index, value.currentTarget.value)) }}
                      value={taskData.goals[index]}
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
        label="Import"
        {...formItemLayout}
      >
        <Upload {...load} fileList={fileList} showUploadList={false}>
          <Button icon={<UploadOutlined />}>Select file</Button>
        </Upload>
      </Form.Item>
    </Form>
  );
}
export default Main;
