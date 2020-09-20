import React from 'react';
import { Form, Button, Input, InputNumber } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { formItemLayout, formItemLayoutWithOutLabel } from '../constants/constants';
import { updateArray, updateSubtasks, updateScore } from './helpers';

const { TextArea } = Input;

type BasicProps = {
  onDataChange: (field: string, value: any) => void;
  taskData: any
}

const Basic: React.FC<BasicProps> = ({ onDataChange, taskData }) => {
  return (
    <Form name="dynamic_form_item" {...formItemLayoutWithOutLabel} >
      <Form.Item
        label="Basic for:"
        {...formItemLayout}
        name="basic-description"
        rules={[{ required: true, message: 'Please input short description!' }]}
        initialValue={taskData.requirements[0]}
      >
        <TextArea
          placeholder="basic scope short description"
          style={{ width: '60%' }}
          autoSize
          onChange={
            (e: React.ChangeEvent<HTMLTextAreaElement>) => {
              onDataChange('requirements', updateArray(taskData.requirements, 0, e.currentTarget.value))
            }
          }
          value={taskData.requirements[0]}
        />
      </Form.Item>
      <Form.List name="basic-tasks">
        {(fields, { add, remove }) => {
          fields.length === 0 && fields.push(...taskData.subtasks[0].basic.map((item: string, index: number) => {
            return {
              fieldKey: index,
              isListField: true,
              key: index,
              name: index,
            }
          }));
          return (
            <div>
              {fields.map((field: any, index: number) => (
                <Form.Item
                  {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                  label={index === 0 ? 'Subtasks' : ''}
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
                        message: "Please input subtask or delete this field.",
                      },
                    ]}
                    noStyle
                  >
                    <div style={{ display: 'flex' }}>
                      <TextArea
                        placeholder="subtask"
                        style={{ width: '60%' }}
                        onChange={
                          (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            onDataChange('subtasks', updateSubtasks(taskData.subtasks, 'basic', index, e.currentTarget.value))
                          }
                        }
                        value={taskData.subtasks[0].basic[index]}
                        autoSize
                      />
                      <InputNumber
                        placeholder="Score"
                        min={0}
                        style={{ width: '11%', marginLeft: '2%' }}
                        onChange={
                          (value: any) => {
                            onDataChange('score', updateSubtasks(taskData.score, 'basic', index, value));
                            onDataChange('maxScore', updateScore(taskData.score));
                          }
                        }
                        value={taskData.score[0].basic[index]}
                      />
                    </div>
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      style={{ margin: '0 8px' }}
                      onClick={() => remove(field.name)}
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
                  <PlusOutlined /> Add subtask
                </Button>
              </Form.Item>
            </div>)
        }}
      </Form.List>
    </Form>
  );
}
export default Basic;
