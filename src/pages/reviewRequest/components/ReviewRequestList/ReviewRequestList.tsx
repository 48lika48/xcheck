import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/rootReducer';
import { deleteRequestItem } from '../../../../store/reducers/reviewRequestSlice';
import { Table, Button, Tag, Popconfirm } from 'antd';
import { FileDoneOutlined, DeleteOutlined } from '@ant-design/icons';
import { IReview, IReviewRequest, ITaskScore, ITaskScoreItem, ReviewRequestState } from '../../../../models';
import { ReviewDetails } from '../ReviewDetails';
import { SelfGradeModal } from '../../../../forms/SelfGradeModal/SelfGradeModal';

type detailsModal = {
  visible: boolean,
  data: ITaskScore | null,
  review?: IReview,
}

type selfCheckModal = {
  visible: boolean,
  taskId: string | null,
}

export const ReviewRequestList: React.FC = () => {

  const dispatch = useDispatch();
  const { reviewRequests, reviews, isLoading } = useSelector((state: RootState) => state.reviewRequest)
  const { githubId } = useSelector((state: RootState) => state.users.currentUser.userData)

  const [detailsModal, setDetailsModal] = useState({ visible: false, data: null } as detailsModal)
  const [selfGradeModal, setSelfGradeModal] = useState({ visible: false, taskId: null } as selfCheckModal)

  const hideDetailsModal = (): void => {
    setDetailsModal((prev: detailsModal) => {
      return { ...prev, visible: false }
    })
  }

  const hideSelfGradeModal = () => {
    setSelfGradeModal((prev: selfCheckModal) => {
      return { ...prev, visible: false }
    })
  }

  const reviewDetailsHandler = (data: ITaskScore | null, record: any, review?: IReview): void => {
    if ('selfCheck' in record) {
      setDetailsModal({ visible: true, data })
    } else if ('reviewDetails' in record) {
      setDetailsModal({ visible: true, data, review: review })
    }
  }
  const selfCheckDetailsHandler = (record: any): void => {
    setSelfGradeModal({ visible: true, taskId: record.task })
    console.log(selfGradeModal)
  }

  const expandedRowRender = (record: any) => {
    const columns = [
      {
        title: 'Reviewer',
        dataIndex: 'reviewer',
        align: 'center' as 'center',
        key: 'reviewer',
        sorter: (a: any, b: any) => a.status.length - b.status.length,
      },
      {
        title: 'Review status',
        dataIndex: 'reviewState',
        align: 'center' as 'center',
        key: 'reviewState',
        render: (reviewState: string) => {
          const getStatus = () => {
            switch (reviewState.toUpperCase()) {
              case 'DRAFT':
                return 'magenta';
              case 'PUBLISHED':
                return 'blue';
              case 'DISPUTED':
                return 'orange';
              case 'ACCEPTED':
                return 'green';
              case 'REJECTED':
                return 'volcano';
              default:
                return
            }
          }
          return (
            <Tag color={getStatus()}>{reviewState}</Tag>
          )
        }
      },
      {
        title: 'Grade',
        dataIndex: 'grade',
        align: 'center' as 'center',
        key: 'grade',
      },
      {
        title: 'Review details',
        dataIndex: 'reviewDetails',
        align: 'center' as 'center',
        key: 'reviewDetails',
        render: (value: IReview, record: any) => (
          <Button shape="circle" icon={<FileDoneOutlined />} onClick={() => reviewDetailsHandler(value.grade, record, value)} />
        )
      },
    ];

    const expandedData = reviews
      .filter((review: IReview) => review.requestId === record.id)
      .map((review: IReview, index: number) => {
        return {
          key: index.toString(),
          reviewer: review.author,
          reviewState: review.state,
          grade: review.grade.items.reduce((previous: number, current: ITaskScoreItem) => previous + current.score, 0),
          reviewDetails: review,
        }
      })
    return <Table columns={columns} dataSource={expandedData} pagination={false} size='small' tableLayout='fixed' />;
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      align: 'center' as 'center',
      key: 'id',
    },
    {
      title: 'Task',
      dataIndex: 'task',
      align: 'center' as 'center',
      key: 'task',
      sorter: (a: any, b: any) => a.status.length - b.status.length,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center' as 'center',
      key: 'status',
      filters: [
        {
          text: ReviewRequestState.COMPLETED,
          value: ReviewRequestState.COMPLETED,
        },
        {
          text: ReviewRequestState.DRAFT,
          value: ReviewRequestState.DRAFT,
        },
        {
          text: ReviewRequestState.PUBLISHED,
          value: ReviewRequestState.PUBLISHED,
        }
      ],
      onFilter: (value: any, record: any) => record.status.indexOf(value) === 0,
      sorter: (a: any, b: any) => a.status.length - b.status.length,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      align: 'center' as 'center',
      key: 'url',
      ellipsis: true,
      render: (text: string) => <a target="_blank" rel="noopener noreferrer" href={text}>{text}</a>,
    },
    {
      title: 'Pull Request URL',
      dataIndex: 'urlPR',
      align: 'center' as 'center',
      key: 'urlPR',
      ellipsis: true,
      render: (text: string) => <a target="_blank" rel="noopener noreferrer" href={text}>{text}</a>,
    },
    {
      title: 'Self-check details',
      dataIndex: 'selfCheck',
      align: 'center' as 'center',
      key: 'selfCheck',
      render: (value: ITaskScore | null, record: any) => {
        if (record.status.toUpperCase() === ReviewRequestState.DRAFT) {
          return (
            <Button shape="circle" icon={<FileDoneOutlined />} onClick={() => selfCheckDetailsHandler(record)} />
          )
        } else {
          return (
            <Tag color='green'>{ReviewRequestState.COMPLETED}</Tag>
          )
        }

      }
    },
    {
      title: 'Delete',
      key: 'action',
      align: 'center' as 'center',
      render: (text: string, record: any) => (
        <Popconfirm title="Sure to delete?" onConfirm={() => dispatch(deleteRequestItem(record.id))}>
          <Button shape="circle" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const data = reviewRequests
    .filter((req: IReviewRequest) => req.author === githubId)
    .map((req: IReviewRequest, index: number) => {
      return {
        key: index.toString(),
        id: req.id,
        task: req.task,
        status: req.state,
        selfCheck: req.selfGrade,
        url: req.url,
        urlPR: req.urlPR,
      }
    })

  return (
    <>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data}
        style={{ marginTop: '20px' }}
        expandable={{ expandedRowRender }}
        pagination={false}
        size='small'
        tableLayout='fixed' />
      <ReviewDetails
        visible={detailsModal.visible}
        hideDetailsModal={hideDetailsModal}
        data={detailsModal.data}
        review={detailsModal.review} />
      <SelfGradeModal taskId={selfGradeModal.taskId} selfGradeHandler={hideSelfGradeModal} isSelfGradeShow={selfGradeModal.visible} />
    </>

  )
}
