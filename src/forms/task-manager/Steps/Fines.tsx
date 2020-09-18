import React from 'react';
import { Form, Button, Input, InputNumber } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { formItemLayout, formItemLayoutWithOutLabel } from '../constants/constants';
import { updateArray, updateSubtasks, updateScore } from './helpers';

const { TextArea } = Input;

type FinesProps = {
  onDataChange: (field: string, value: any) => void;
  taskData: any
}

export const Fines: React.FC<FinesProps> = ({ onDataChange, taskData }) => {

  return (
    <Form name="dynamic_form_item" {...formItemLayoutWithOutLabel} >
      <Form.Item
        label="Fines for:"
        {...formItemLayout}
        name="fines-description"
        initialValue={taskData.requirements[3]}
        rules={[{ required: true, message: 'Please input short description!' }]}
      >
        <TextArea
          placeholder="Fines short description"
          style={{ width: '60%' }}
          onChange={
            (e: React.ChangeEvent<HTMLTextAreaElement>) => {
              onDataChange('requirements', updateArray(taskData.requirements, 3, e.currentTarget.value))
            }
          }
          value={taskData.requirements[3]}
          autoSize />
      </Form.Item>
      <Form.List name="fines-tasks">
        {(fields, { add, remove }) => {
          fields.push(...taskData.subtasks[3].fines.map((item: string, index: number) => {
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
                  label={index === 0 ? 'Fines' : ''}
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
                        message: "Please input fine or delete this field.",
                      },
                    ]}
                    noStyle
                  >
                    <div style={{ display: 'flex' }}>
                      <TextArea
                        placeholder="fine"
                        style={{ width: '60%' }}
                        onChange={
                          (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            onDataChange('subtasks', updateSubtasks(taskData.subtasks, 'fines', index, e.currentTarget.value))
                          }
                        }
                        value={taskData.subtasks[3].fines[index]}
                        autoSize />
                      <InputNumber
                        placeholder="Score"
                        max={0}
                        style={{ width: '11%', marginLeft: '2%' }}
                        onChange={
                          (value: any) => {
                            onDataChange('score', updateSubtasks(taskData.score, 'fines', index, value));
                            onDataChange('maxScore', updateScore(taskData.score));
                          }
                        }
                        value={taskData.score[3].fines[index]}
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
                  <PlusOutlined /> Add fine
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>
    </Form>
  );
}

export default Fines;
