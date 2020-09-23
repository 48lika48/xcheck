import React from 'react';
import { Button, Popconfirm, Space, Table, Tag } from 'antd';
import { ICheckSession } from '../../../../models';
import moment from 'moment';

export const SessionsTable = (props: {
  sessions: ICheckSession[];
  openRow: (id: string) => void;
  handleDelete: (id: string) => void;
}) => {
  const { sessions, openRow, handleDelete } = props;
  const columns = [
    {
      title: 'Task name',
      dataIndex: 'taskId',
      sorter: (a: { taskId: string | any[] }, b: { taskId: string | any[] }) =>
        a.taskId.length - b.taskId.length,
    },
    {
      title: 'Status',
      dataIndex: 'state',
      render: function (state: any) {
        const getColor = (state: string) => {
          switch (state.toUpperCase()) {
            case 'DRAFT':
              return 'magenta';
            case 'REQUESTS_GATHERING':
              return 'blue';
            case 'CROSS_CHECK':
              return 'orange';
            case 'COMPLETED':
              return 'green';
          }
        };
        return <Tag color={getColor(state)}>{state.toUpperCase()}</Tag>;
      },
      filters: [
        {
          text: 'DRAFT',
          value: 'DRAFT',
        },
        {
          text: 'REQUESTS GATHERING',
          value: 'REQUESTS_GATHERING',
        },
        {
          text: 'CROSS CHECK',
          value: 'CROSS_CHECK',
        },
        {
          text: 'COMPLETED',
          value: 'COMPLETED',
        },
      ],
      onFilter: (value: any, record: { state: string | any[] }) =>
        record.state.indexOf(value) === 0,
    },
    {
      title: 'Ends',
      dataIndex: 'endDate',
      render: (text: string) => <>{moment(text).format('Do MMM YY')}</>,
      sorter: (a: any, b: any) => a.endDate - b.endDate,
    },
    {
      title: 'Action',
      render: (text: String, record: any) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              openRow(record.id);
            }}
          >
            Edit
          </Button>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return <Table dataSource={sessions} columns={columns} rowKey="id" />;
};
