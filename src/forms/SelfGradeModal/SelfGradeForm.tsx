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
  const { task, loading } = useSelector((state: RootState) => state.selfGradeSlice);
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
        {task && task.items ? (
          task.items.map((item: any, i: number) => {
            return (
              <Form
                key={task.items && task.items.length - i}
                initialValues={{ remember: false }}
                validateMessages={validateMessages}
                onFinish={(values) => {
                  values.item.id = item.id;
                  dispatch(saveTaskScoreResults(values.item));
                }}
              >
                <Paragraph>
                  <Text strong>{item.category}</Text>
                </Paragraph>
                <Paragraph>{item.title}</Paragraph>
                <Form.Item
                  name={['item', 'score']}
                  label={`Score from ${item.minScore} to ${item.maxScore}`}
                  rules={[
                    {
                      type: 'number',
                      min: item.minScore,
                      max: item.maxScore,
                      required: true
                    }
                  ]}
                >
                  <InputNumber id={`${item.id}_score_${i}`} />
                </Form.Item>
                <Form.Item
                  name={['item', 'comment']}
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
