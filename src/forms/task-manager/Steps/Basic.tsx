import React from 'react';
import { Form, Button, Input, InputNumber } from 'antd'; 
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {formItemLayout, formItemLayoutWithOutLabel} from '../constants/constants';
import { updateArray, updateSubtasks} from './helpers';

const { TextArea } = Input;

const Basic: React.FC<{ onDataChange: any; taskData: any }> = (props) => {   
  return (
    <Form name="dynamic_form_item" {...formItemLayoutWithOutLabel} >
      <Form.Item
        label="Basic for:"
        {...formItemLayout}
        name="basic-description"
        rules={[{ required: true, message: 'Please input short description!' }]}
      >
        <TextArea 
          placeholder="basic scope short description" 
          style={{ width: '60%' }} 
          autoSize
          onChange={(value: any) => {props.onDataChange('requirements', updateArray(props.taskData.requirements, 0, value.currentTarget.value))}}
          defaultValue={props.taskData.requirements[0]}
          />
      </Form.Item>
      <Form.List name="basic-tasks">
        {(fields, { add, remove }) => {
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
                    <div style={{display: 'flex'}}>
                      <TextArea 
                        placeholder="subtask" 
                        style={{ width: '60%' }} 
                        onChange={(value: any) => {props.onDataChange('subtasks', updateSubtasks(props.taskData.subtasks, 'basic', index, value.currentTarget.value))}}
                        defaultValue={props.taskData.subtasks[0].basic[index]}  
                        autoSize
                      />
                      <InputNumber 
                        placeholder="Score" 
                        min={0} 
                        style={{ width: '11%', marginLeft: '2%' }}
                        />
                    </div>
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
export default Basic;
