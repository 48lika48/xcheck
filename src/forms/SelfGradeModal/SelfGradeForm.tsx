import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/rootReducer';
import { SmileTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import {
  Spin,
  Space,
  Form,
  Button,
  InputNumber,
  Input,
  Popover,
  Typography,
  Divider
} from 'antd';
import { Iprops } from './SelfGradeModal';
import { fetchTasks } from 'src/store/reducers/selfGradeReducer';

const { Paragraph, Text } = Typography;
const { TextArea } = Input;

const inputStyle = {
  display: "block",
  maxWidth: "300px",
  marginTop: "10px",
}

export const SelfGradeForm: React.FC<Iprops> = (props: any) => {

  const dispatch = useDispatch();
  useEffect(() => { dispatch(fetchTasks(props.taskId)) }, []);
  const { tasks, loading, error, taskScore } = useSelector((state: RootState) => state.selfGradeReducer);

  // const [score, setScore] = useState(0);
  // const [comment, setComment] = useState('');

  // const onChangeComment = (event: React.FormEvent<HTMLTextAreaElement>): void => {
  //   setComment(event.currentTarget.value);
  // }
  // const onChangeScore = (score: any): void => {
  //   setScore(score);
  // }
  console.log(taskScore.items);
  return (
    loading
      ?
      <Space>
        <Spin />
        <p>Task Loading...</p>
      </Space>
      :
      <React.Fragment>
        {
          tasks.items ?
            tasks.items.map((item: any, i: number) => {
              return <Form
                key={i}
                initialValues={{ remember: false }}
                // onFinish={() => {
                //   alert(`${score} | ${comment} ||| ${tasks.items[0].id}`);
                // }}
              >
                <Paragraph><Text strong>{item.category}</Text></Paragraph>
                <Paragraph>{item.title}</Paragraph>
                <Form.Item label="Score: ">
                  <Popover
                    content={`Min: ${item.minScore} Max: ${item.maxScore}`}
                    title='Points'
                    trigger="focus">
                    <InputNumber
                      min={item.minScore}
                      max={item.maxScore}
                      required={true}
                      // onChange={onChangeScore}
                    />
                  </Popover>
                  <TextArea
                    placeholder="Comment"
                    style={inputStyle}
                    autoSize
                    // onChange={onChangeComment}
                  />
                </Form.Item>
                <Button
                  htmlType="submit"
                  icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                >Save comment
                </Button>
                <Divider />
              </Form>
            })
            : null
        }
        <Button
          onClick={props.handleConfirmClick}
        >
          Confirm
              <SmileTwoTone />
        </Button>
      </React.Fragment>
  )
}
