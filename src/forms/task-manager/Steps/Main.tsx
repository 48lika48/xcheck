import * as React from 'react';
import { Form, Button, Input, Space, Upload, DatePicker, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { formItemLayout, formItemLayoutWithOutLabel } from '../constants/constants';
import { updateArray } from './helpers';
import { parsTask } from 'src/services/taskparser';
import { saveTask } from 'src/services/savetask';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

type MainProps = {
  onDataChange: (field: string, value: any) => void;
  taskData: any
}

const Main: React.FC<MainProps> = ({ onDataChange, taskData }) => {
  const [fileList, setFileList] = React.useState([{ uid: null }]);

  const showMessage = (isUploaded: boolean) => {
    isUploaded
      ? message.success(`file uploaded successfully.`)
      : message.error(`file upload failed.`);
  }

  const load: any = {
    name: 'file',
    accept: '.json, .md',
    customRequest: (options: any) => parsTask({ file: options.file, onDataChange, showMessage }),
    fileList,
    showUploadList: false,
    onChange: async (info: any) => setFileList([info.file]),
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
                      onChange={
                        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          onDataChange('goals', updateArray(taskData.goals, index, e.currentTarget.value))
                        }
                      }
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
      <Form.Item
        label="Import/export data"
        {...formItemLayout}>
        <Space>

          <Upload {...load}>
            <Button icon={<UploadOutlined />}>Import data</Button>
          </Upload>

          <Button icon={<DownloadOutlined />} onClick={() => saveTask(taskData)}>
            Export data
        </Button>
        </Space>
      </Form.Item>

    </Form>
  );
}
export default Main;
