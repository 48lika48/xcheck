import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/rootReducer';
import { loadTasks } from '../../store/actions/selfGradeAction';
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

const { Paragraph, Text } = Typography;
const { TextArea } = Input;

const inputStyle = {
  display: "block",
  maxWidth: "300px",
  marginTop: "10px",
}

// type ItemsProps = {
//   id: string | null
//   score: number | null
//   comment: string | null
// }

// type taskCoreType = {
//   task: string | null,
//   items: Array<ItemsProps>
// }

export const SelfGradeForm: React.FC<Iprops> = (props: any) => {

  const dispatch = useDispatch();

  const { task, loading } = useSelector((state: RootState) => state.selfGradeReducer);

  console.log(task, loading);

  const [comment, setComment] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => { dispatch(loadTasks(props.taskId)) }, []);

  const onChangeComment = (event: React.FormEvent<HTMLTextAreaElement>): void => {
    setComment(event.currentTarget.value);
  }
  const onChangeScore = (score: any): void => {
    setScore(score);
  }

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
          task.items ?
            task.items.map((item: any, i: number) => {
              return <Form
                key={i}
                initialValues={{ remember: false }}
                onFinish={() => {
                  alert(`${score} | ${comment} ||| ${task.items[0].id}`);
                }}
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
                      onChange={onChangeScore}
                    />
                  </Popover>
                  <TextArea
                    placeholder="Comment"
                    style={inputStyle}
                    autoSize
                    onChange={onChangeComment}
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
