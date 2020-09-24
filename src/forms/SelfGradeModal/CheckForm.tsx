import React from 'react';
import { Space, Form, Button, Input, InputNumber, Typography, Divider } from 'antd';
import { useDispatch } from 'react-redux';
import { saveTaskScoreResults } from 'src/store/reducers/selfGradeSlice';

const { Paragraph, Text } = Typography;
const { TextArea } = Input;

const inputStyle = {
  display: 'block',
  maxWidth: '300px',
  marginTop: '10px'
};

const validateMessages = {
  required: 'Field is required!',
  types: {
    number: 'Score is not a validate number!'
  },
  number: {
    range: 'Score must be between min and max'
  }
};

export const CheckForm: React.FC<any> = ({ item, index }) => {

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      id={index.toString()}
      validateMessages={validateMessages}
    >

      <Paragraph>
        {!item.maxScore ?
          <Text type='danger' strong>{item.category}</Text>
          : <Text strong>{item.category}</Text>}
      </Paragraph>
      <Paragraph>{item.title}</Paragraph>
      <Space>
        <Button type='dashed' onClick={() => {
          dispatch(saveTaskScoreResults({ id: item.id, score: item.minScore }));
          form.setFieldsValue({
            score: item.minScore
          });
        }}>0%</Button>
        <Button type='default' onClick={() => {
          dispatch(saveTaskScoreResults({ id: item.id, score: (item.minScore + item.maxScore) / 2 }));
          form.setFieldsValue({
            score: (item.minScore + item.maxScore) / 2
          });
        }}>50%</Button>
        <Button type='primary' onClick={() => {
          dispatch(saveTaskScoreResults({ id: item.id, score: item.maxScore }));
          form.setFieldsValue({
            score: item.maxScore
          });
        }}>100%</Button>
      </Space>
      <Form.Item
        name='score'
        shouldUpdate={true}
        initialValue={item.score}
        label={`Score from ${item.minScore} to ${item.maxScore}`}
        rules={[
          {
            type: 'number',
            min: item.minScore,
            max: item.maxScore,
            required: true
          }
        ]}
        style={{ margin: '10px 0' }}
      >
        <InputNumber
          id={`${item.id}_score_${index}`}
          onChange={(scoreValue) => {
            dispatch(saveTaskScoreResults({ id: item.id, score: scoreValue }))
          }}
        />
      </Form.Item>
      <Form.Item
        name='comment'
        label="Comment"
        rules={[{ required: false }]}
      >
        <TextArea
          placeholder="Comment"
          style={inputStyle}
          autoSize id={`${item.id}_comment_${index}`}
          onBlur={(event) => {
            if (event.currentTarget.value.trim().length) {
              dispatch(saveTaskScoreResults({ id: item.id, comment: event.currentTarget.value }))
            }
          }}
        />
      </Form.Item>
      <Divider />
    </Form>
  )
}
