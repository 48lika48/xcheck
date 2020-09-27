import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Spin } from 'antd';
import { RootState } from '../../store/rootReducer';
import {
  fetchSessions,
  showModal,
  hideModal,
  startEdit,
  endEdit,
  editSession,
  setSession,
  deleteSession,
} from '../../store/reducers/crossSessionsSlice';
import { PlusOutlined } from '@ant-design/icons';
import { SessionsTable } from './components/sessionsTable';
import { CrossSessionCreate } from '../crossSessionCreatePage';
import { ICheckSession, ITask, TaskState } from '../../models';

export const CrossSessionsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { sessions, loading, isShowModal, isEdit, editData, requests } = useSelector(
    (state: RootState) => state.crossSessions
  );
  const { allTasks } = useSelector((state: RootState) => state.tasks);
  const getData = useCallback(() => {
    dispatch(fetchSessions());
  }, [dispatch]);
  useEffect(() => {
    getData();
  }, [dispatch, getData]);

  function handleClick() {
    dispatch(showModal());
  }

  function closeHandler() {
    dispatch(hideModal());
    dispatch(fetchSessions());
    if (isEdit) {
      dispatch(endEdit());
    }
  }

  function openHandler(id: string) {
    dispatch(showModal());
    dispatch(startEdit(id));
  }

  function formSave(values: ICheckSession) {
    isEdit ? dispatch(editSession(values, values.id)) : dispatch(setSession(values));
    closeHandler();
  }

  function handleDelete(id: string) {
    dispatch(deleteSession(id));
  }

  function sortTasks(taskArray: ITask[], sessionsArray: ICheckSession[]) {
    taskArray = taskArray.filter((i) => i.state === TaskState.PUBLISHED);
    return taskArray.filter(
      (element) => !sessionsArray.find((session) => session.taskId === element.id)
    );
  }

  return (
    <Spin spinning={loading}>
      <Button
        disabled={sortTasks(allTasks, sessions).length === 0}
        onClick={() => handleClick()}
        type="primary"
        style={{
          marginBottom: 16,
        }}
        icon={<PlusOutlined />}
      >
        Add a session
      </Button>
      {sortTasks(allTasks, sessions).length === 0 && (
        <Alert message={'Sessions for all published tasks was created'} type="success" banner />
      )}
      <CrossSessionCreate
        isShowModal={isShowModal}
        closeManager={closeHandler}
        tasks={sortTasks(allTasks, sessions)}
        isEdit={isEdit}
        editData={editData}
        onSave={formSave}
        requests={requests}
      />
      <SessionsTable sessions={sessions} openRow={openHandler} handleDelete={handleDelete} />
    </Spin>
  );
};
