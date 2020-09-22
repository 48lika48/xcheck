import React from 'react';
import { Modal, Space, Typography, Form, Button, Input, Result } from 'antd';
import { ITaskScore, ITaskScoreItem } from '../../../../models';

const { Title, Text } = Typography

type ReviewDetailsProps = {
  data: ITaskScore | null;
  visible: boolean;
  hideDetailsModal: () => void;
  isReviewMode: boolean,
}

export const ReviewDetails: React.FC<ReviewDetailsProps> = ({ visible, hideDetailsModal, data, isReviewMode }) => {

  const [form] = Form.useForm();

  const handleOk = () => {
    hideDetailsModal()
  };

  const handleCancel = () => {
    hideDetailsModal()
  };

  return (
    <Modal
      title={isReviewMode ? `Review details` : `Self-check details`}
      visible={visible}
      centered
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}
    >
      {data?.items ? data?.items.map((item: ITaskScoreItem) => {
        const description = (
          <>
            <Title level={4}>{item.id}</Title>
            <Text>{item.score}</Text>
            <Text type="secondary">{item.comment}</Text>
          </>
        )
        return isReviewMode ? {description} : (
          <Space direction="vertical">
            {description}
            <Form form={form} layout="vertical" onFinish={() => console.log('Disput')}>
              <Form.Item name="taskId" label="Disput">
                <Input placeholder="Write your comments" />
              </Form.Item>
              <Form.Item>
                <Button style={{ marginTop: 16 }} type="primary" htmlType="submit">
                  Disput
                </Button>
              </Form.Item>
            </Form>
            </Space>
          )
        }) : <Result title="No review data" />
      }
    </Modal>
  );
}
