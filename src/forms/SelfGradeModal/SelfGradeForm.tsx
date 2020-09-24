import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/rootReducer';
import { SmileTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import { Spin, Space, Form, Button, Input, InputNumber, Typography, Divider } from 'antd';
import { getData, saveTaskScoreResults } from 'src/store/reducers/selfGradeSlice';

const { Paragraph, Text } = Typography;
const { TextArea } = Input;

const inputStyle = {
  display: 'block',
  maxWidth: '300px',
  marginTop: '10px'
};

type Iprops = {
  taskId?: string | null;
  handleEndCheck: () => void;
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

export const SelfGradeForm: React.FC<Iprops> = (props: any) => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state: RootState) => state.reviewRequest);
  const { loading, taskScore } = useSelector((state: RootState) => state.selfGradeSlice);
  useEffect(
    () => {
      dispatch(getData(tasks, props.taskId));
    },
    [dispatch, props.taskId, tasks]
  );

  return loading ? (
    <Space>
      <Spin />
      <p>Task Loading...</p>
    </Space>
  ) : (
      <React.Fragment>
        {taskScore && taskScore.items ? (
          taskScore.items.map((item: any, i: number) => {
            return (
              <Form
                key={taskScore.items && taskScore.items.length - i}
                id={i.toString()}
                initialValues={{ remember: false, score: item.score }}
                validateMessages={validateMessages}
                onFinish={(values) => {
                  values.id = item.id;
                  console.log(values);
                  dispatch(saveTaskScoreResults(values));
                }}
              // onValuesChange={}
              >
                <Paragraph><Text strong>{item.category}</Text></Paragraph>
                <Paragraph>{item.title}</Paragraph>
                <Space>
                  <Button type='dashed' onClick={() => {
                    dispatch(saveTaskScoreResults({ ...item, score: item.minScore }))
                  }}>0%</Button>
                  <Button type='default' onClick={() => {
                    dispatch(saveTaskScoreResults({ ...item, score: (item.minScore + item.maxScore) / 2 }))
                  }}>50%</Button>
                  <Button type='primary' onClick={() => {
                    dispatch(saveTaskScoreResults({ ...item, score: item.maxScore }))
                  }}>100%</Button>
                </Space>
                <Form.Item
                  name='score'
                  label={`Score from ${item.minScore} to ${item.maxScore}`}
                  rules={[
                    {
                      type: 'number',
                      min: item.minScore,
                      max: item.maxScore,
                      required: true
                    }
                  ]}
                  style={{ margin: '5px 0' }}
                >
                  <InputNumber
                    id={`${item.id}_score_${i}`}
                    onChange={(scoreValue) => {
                      dispatch(saveTaskScoreResults({ ...item, score: scoreValue }))
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name='comment'
                  label="Comment"
                  rules={[
                    {
                      required: false
                    }
                  ]}
                >
                  <TextArea placeholder="Comment" style={inputStyle} autoSize id={`${item.id}_comment_${i}`} />
                </Form.Item>

                <Button htmlType="submit" icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}>
                  Save this item
                </Button>
                <Divider />
              </Form>
            );
          })
        ) : (
            <Paragraph>Close Modal and open later</Paragraph>
          )}
        <Button onClick={props.handleEndCheck}>
          End and Save Check
        <SmileTwoTone />
        </Button>
      </React.Fragment>
    );
};
