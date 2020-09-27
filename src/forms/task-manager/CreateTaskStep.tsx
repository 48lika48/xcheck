import React from 'react';
import { Form, Button, Input, InputNumber } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { formItemLayout, formItemLayoutWithOutLabel } from './constants/constants';
import { updateArray, updateSubtasks, updateMaxScore, updateScores } from './helpers';
import { ITask, UserRole } from 'src/models';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/rootReducer';

const { TextArea } = Input;

type StepProps = {
  stepId: string;
  onDataChange: (field: string, value: any) => void;
  taskData: ITask
}

const CreateTaskStep: React.FC<StepProps> = ({ stepId, onDataChange, taskData }) => {
  const { currentRole } = useSelector((state: RootState) => state.users.currentUser);
  const isDisabled = currentRole === UserRole.student;
  return (
    <Form name="dynamic_form_item" {...formItemLayoutWithOutLabel} >
      <Form.Item
        label={`${stepId[0].toUpperCase() + stepId.slice(1)} for:`}
        {...formItemLayout}
        name={`${stepId}-description`}
        rules={[{ required: true, message: 'Please input short description!' }]}
        initialValue={taskData.requirements && taskData.requirements[0]}
      >
        <TextArea
          placeholder={`${stepId} scope short description`}
          style={{ width: '60%' }}
          autoSize
          disabled={isDisabled}
          onChange={
            (e: React.ChangeEvent<HTMLTextAreaElement>) => {
              taskData.requirements && onDataChange('requirements', updateArray(taskData.requirements, 0, e.currentTarget.value))
            }
          }
          value={taskData.requirements && taskData.requirements[0]}
        />
      </Form.Item>
      <Form.List name={`${stepId}-tasks`}>
        {(fields, { add, remove }) => {
          fields.length === 0 && taskData.subtasks && fields.push(...taskData.subtasks[stepId].map((item: string, index: number) => {
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
                        disabled={isDisabled}
                        onChange={
                          (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            onDataChange('subtasks', updateSubtasks(taskData.subtasks, stepId, index, e.currentTarget.value))
                          }
                        }
                        value={taskData.subtasks && taskData.subtasks[stepId][index]}
                        autoSize
                      />
                      <InputNumber
                        placeholder="Score"
                        min={0}
                        style={{ width: '11%', marginLeft: '2%' }}
                        disabled={isDisabled}
                        onChange={
                          (value: any) => {
                            onDataChange('score', updateScores(taskData.score, stepId, index, +value));
                            onDataChange('maxScore', updateMaxScore(taskData.score));
                          }
                        }
                        value={taskData.score && taskData.score[stepId][index]}
                      />
                    </div>
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      style={{ margin: '0 8px' }}
                      hidden={isDisabled}
                      onClick={() => {
                        remove(field.name)
                        updateArray(taskData.goals || [], index, '')
                      }}
                    />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  hidden={isDisabled}
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
export default CreateTaskStep;
