import React from 'react';
import { useDispatch } from 'react-redux';
import { addDisputeData, updateReviewState  } from '../../../../store/reducers/reviewRequestSlice';
import { Modal, Space, Typography, Form, Button, InputNumber, Result, Input } from 'antd';
import { IDispute, ITaskScore, ITaskScoreItem, DisputeState, IReview } from '../../../../models';

const { Title, Text } = Typography
const { TextArea } = Input

type ReviewDetailsProps = {
  data: ITaskScore | null;
  visible: boolean;
  hideDetailsModal: () => void;
  review: IReview | undefined,
}

export const ReviewDetails: React.FC<ReviewDetailsProps> = (props) => {

  const dispatch = useDispatch();

  const { visible, hideDetailsModal, data, review } = props

  const [form] = Form.useForm();

  const handleOk = () => {
    hideDetailsModal()
  };

  const handleCancel = () => {
    hideDetailsModal()
  };

  type DisputFormValue = {
    suggestedScore: number,
    comment: string,
  }

  const submitHandler = (value: DisputFormValue, itemId: string) => {
    if (review) {
      const disputeDetails: IDispute = {
        reviewId: review.id,
        state: DisputeState.ONGOING,
        item: itemId,
        comment: value.comment,
        suggestedScore: value.suggestedScore,
      }
      dispatch(addDisputeData(disputeDetails))
      dispatch(updateReviewState(review))
    }
  }

  const formStyle = {
    display: 'flex',
    justifyContent: 'center',
    padding: '5px',
    marginBottom: '5px',
    background: '#fbfbfb',
    border: '1px solid #d9d9d9',
    borderRadius: '2px',
  }

  return (
    <Modal
      title={'Review details'}
      visible={visible}
      centered
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
    >
      {data?.items ? data?.items.map((item: ITaskScoreItem, index: number) => {
        return (
          <Space direction="vertical" key={item.id} style={formStyle}>
            <Title level={5}>{item.id}</Title>
            <Text>{`Score: ${item.score}`}</Text>
            <Text type="secondary">{`Comment ${item.comment}`}</Text>
            <Form form={form} layout="inline" onFinish={(value) => submitHandler(value, item.id)}>
              <Form.Item
                name={`suggestedScore${index.toString()}`}
                label={'Suggested score'}
                rules={[
                  {
                    type: 'number',
                  }
                ]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                name={`comment: ${index.toString()}`}
                label="Comment"
                rules={[
                  {
                    required: false
                  }
                ]}
              >
                <TextArea placeholder="Comment" autoSize />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Set disput
                </Button>
              </Form.Item>
            </Form>
          </Space>
        )
      }) : <Result title={review ? "No review data" : "No self-check data"} />
      }
    </Modal>
  );
}
