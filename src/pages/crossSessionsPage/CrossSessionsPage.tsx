import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Spin } from 'antd';
import { RootState } from '../../store/rootReducer';
import { fetchSessions } from '../../store/reducers/crossSessionsSlice';
import { PlusOutlined } from '@ant-design/icons';
import { SessionsTable } from './components/sessionsTable';

export const CrossSessionsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { sessions, loading } = useSelector((state: RootState) => state.crossSessions);
  const getData = useCallback(() => {
    dispatch(fetchSessions());
  }, [dispatch]);
  useEffect(() => {
    getData();
  }, [dispatch, getData]);
  return (
    <Spin spinning={loading}>
      <Button
        onClick={() => console.log('add')}
        type="primary"
        style={{
          marginBottom: 16,
        }}
        icon={<PlusOutlined />}
      >
        Add a session
      </Button>
      <SessionsTable sessions={sessions} />
    </Spin>
  );
};
