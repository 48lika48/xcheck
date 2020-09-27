import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/rootReducer';
import { SmileTwoTone } from '@ant-design/icons';
import { Spin, Space, Button, Typography } from 'antd';
import { getData } from 'src/store/reducers/selfGradeSlice';
import { CheckForm } from './CheckForm';

const { Paragraph } = Typography;

type Iprops = {
  taskId?: string | null;
  handleEndCheck: () => void;
};

export const SelfGradeForm: React.FC<Iprops> = (props: any) => {
  const dispatch = useDispatch();
  const checkFormsElements: Array<any> | undefined = [];
  const { tasks } = useSelector((state: RootState) => state.reviewRequest);
  const { task, loading } = useSelector((state: RootState) => state.selfGradeSlice);
  useEffect(
    () => {
      dispatch(getData(tasks, props.taskId));
    },
    [dispatch, props.taskId, tasks]
  );
  if (task && task.subtasks) {
    Object.keys(task.subtasks).map((category: string) => {
      return (
        task.subtasks && task.subtasks[category].forEach((item: any, index: number) => {
          checkFormsElements.push(
            <CheckForm
              key={task.subtasks && task.score && `${category}_item${index}`}
              subtask={item}
              score={task.score && task.score[category][index]}
              category={category}
              index={index}
            />);
        }))
    })
  }

  return loading ? (
    <Space>
      <Spin />
      <p>Task Loading...</p>
    </Space>
  ) : (
      <React.Fragment>
        {
          task && task.subtasks ? (checkFormsElements)
            :
            (<Paragraph>Close Modal and open later</Paragraph>)
        }
        <Button onClick={props.handleEndCheck}>
          Save and Close Check
        <SmileTwoTone />
        </Button>
      </React.Fragment>
    );
};
