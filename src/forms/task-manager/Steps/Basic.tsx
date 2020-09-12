import React from 'react';
import { Form, Button, Input, InputNumber } from 'antd'; 
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {formItemLayout, formItemLayoutWithOutLabel} from '../constants/constants'


const { TextArea } = Input;

const Basic: React.FC = (props) => {
 
  return (
    <Form name="dynamic_form_item" {...formItemLayoutWithOutLabel} >
      <Form.Item
        label="Basic for:"
        {...formItemLayout}
        name="basic-description"
        rules={[{ required: true, message: 'Please input short description!' }]}
      >
        <TextArea placeholder="basic scope short description" style={{ width: '60%' }} autoSize/>
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
                      <TextArea placeholder="subtask" style={{ width: '60%' }} autoSize/>
                      <InputNumber placeholder="Score" min={0} style={{ width: '11%', marginLeft: '2%' }}/>
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