import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadTasks } from '../../store/actions/selfGradeAction';
import { Spin, Space } from 'antd';
// const { Option } = Select;

export const SelfGradeForm: React.FC = (props: any): any => {

  const dispatch = useDispatch();

  useEffect(() => { dispatch(loadTasks(props.taskId)) }, []);

  return (
    props.selfGrade.loading ?
      <React.Fragment>
        <Space>
          <Spin />
          <p>Task Loading...</p>
        </Space>
      </React.Fragment>
      :
      <React.Fragment>
        <p>{props.selfGrade.task.id}</p>
      </React.Fragment>
  )
}