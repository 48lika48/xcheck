import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadTasks } from '../../store/actions/selfGradeAction';
import { SmileTwoTone } from '@ant-design/icons';
import {
  Spin,
  Space,
  Form,
  Button,
  InputNumber,
  Popover,
  Typography,
  Divider
} from 'antd';
import { Iprops } from './SelfGradeModal';

const { Paragraph, Text } = Typography;

export const SelfGradeForm: React.FC<Iprops> = (props: any) => {

  const dispatch = useDispatch();

  useEffect(() => { dispatch(loadTasks(props.taskId)) }, []);

  return (
    props.selfGrade.loading
      ?
      <Space>
        <Spin />
        <p>Task Loading...</p>
      </Space>
      :
      <React.Fragment>
        <Form
          initialValues={{ remember: false }}
          onFinish={props.handleConfirmClick}
        >
          {
            props.selfGrade.task.items ?
              props.selfGrade.task.items.map((item: any, i: number) => {
                return <div key={i}>
                  <Paragraph><Text strong>{item.category}</Text></Paragraph>
                  <Paragraph>{item.title}</Paragraph>
                  <Form.Item label="Score: ">
                    <Popover
                      content={`Min: ${item.minScore} Max: ${item.maxScore}`}
                      title='Points'
                      trigger="focus">
                      <InputNumber
                        defaultValue={0}
                        min={item.minScore}
                        max={item.maxScore}
                        required={true}
                      />
                    </Popover>
                  </Form.Item>
                  <Divider />
                </div>
              })
              : null
          }
          <Form.Item>
            <Button htmlType="submit">
              Confirm
              <SmileTwoTone />
            </Button>
          </Form.Item>
        </Form>
      </React.Fragment>
  )
}
