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

export const CheckForm: React.FC<any> = ({ subtask, score, category, index }) => {

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const minScore = score >= 0 ? 0 : score;
  const maxScore = score > 0 ? score : 0;
  const averageScore = (maxScore + minScore) / 2;

  return (
    <Form
      form={form}
      validateMessages={validateMessages}
    >
      <Paragraph>
        {!maxScore ?
          <Text type='danger' strong>{category}</Text>
          : <Text strong>{category}</Text>}
      </Paragraph>
      <Paragraph>{subtask}</Paragraph>
      <Space>
        <Button type='dashed' onClick={() => {
          dispatch(saveTaskScoreResults({ id: `${category}_item_${index}`, score: minScore, subtask: subtask }));
          form.setFieldsValue({
            score: minScore
          });
        }}>0%</Button>
        <Button type='default' onClick={() => {
          dispatch(saveTaskScoreResults({ id: `${category}_item_${index}`, score: averageScore, subtask: subtask }));
          form.setFieldsValue({
            score: averageScore
          });
        }}>50%</Button>
        <Button type='primary' onClick={() => {
          dispatch(saveTaskScoreResults({ id: `${category}_item_${index}`, score: maxScore, subtask: subtask }));
          form.setFieldsValue({
            score: maxScore
          });
        }}>100%</Button>
      </Space>
      <Form.Item
        name='score'
        shouldUpdate={true}
        initialValue={''}
        label={`Score from ${minScore} to ${maxScore}`}
        rules={[
          {
            type: 'number',
            min: minScore,
            max: maxScore,
            required: true
          }
        ]}
        style={{ margin: '10px 0' }}
      >
        <InputNumber
          id={`${category}_score_${index}`}
          onChange={(scoreValue) => {
            dispatch(saveTaskScoreResults(
              {
                id: `${category}_item_${index}`,
                score: scoreValue,
                subtask: subtask
              }))
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
          autoSize
          id={`${category}_comment_${index}`}
          onBlur={(event) => {
            if (event.currentTarget.value.trim().length) {
              dispatch(saveTaskScoreResults(
                {
                  id: `${category}_item_${index}`,
                  comment: event.currentTarget.value,
                  subtask: subtask
                }))
            }
          }}
        />
      </Form.Item>
      <Divider />
    </Form>
  )
}
