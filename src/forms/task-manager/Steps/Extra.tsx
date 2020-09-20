import React from 'react';
import { Form, Button, Input, InputNumber } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { formItemLayout, formItemLayoutWithOutLabel } from '../constants/constants';
import { updateArray, updateSubtasks, updateScore } from './helpers';

const { TextArea } = Input;

type ExtraProps = {
  onDataChange: (field: string, value: any) => void;
  taskData: any
}

const Extra: React.FC<ExtraProps> = ({ onDataChange, taskData }) => {

  return (
    <Form name="dynamic_form_item" {...formItemLayoutWithOutLabel} >
      <Form.Item
        label="Extra for:"
        {...formItemLayout}
        name="extra-description"
        initialValue={taskData.requirements[2]}
        rules={[{ required: true, message: 'Please input short description!' }]}
      >
        <TextArea
          placeholder="advanced scope short description"
          style={{ width: '60%' }}
          onChange={
            (e: React.ChangeEvent<HTMLTextAreaElement>) => {
              onDataChange('requirements', updateArray(taskData.requirements, 2, e.currentTarget.value))
            }
          }
          value={taskData.requirements[2]}
          autoSize />
      </Form.Item>
      <Form.List name="advanced-tasks">
        {(fields, { add, remove }) => {
          fields.length === 0 && fields.push(...taskData.subtasks[2].extra.map((item: string, index: number) => {
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
                            onDataChange('subtasks', updateSubtasks(taskData.subtasks, 'extra', index, e.currentTarget.value))
                          }
                        }
                        value={taskData.subtasks[2].extra[index]}
                        autoSize />
                      <InputNumber
                        placeholder="Score"
                        min={0}
                        style={{ width: '11%', marginLeft: '2%' }}
                        onChange={
                          (value: any) => {
                            onDataChange('score', updateSubtasks(taskData.score, 'extra', index, value));
                            onDataChange('maxScore', updateScore(taskData.score));
                          }
                        }
                        value={taskData.score[2].extra[index]}
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
            </div>
          );
        }}
      </Form.List>
    </Form>
  );
}

export default Extra;
