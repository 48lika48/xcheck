import React, { useState } from 'react';
import { Space, Row, Button, InputNumber, Form, Col, Typography, Input } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { ITaskScoreItem } from '../../../../models';

const { Title, Text } = Typography
const { TextArea } = Input

type DisputeFormProps = {
  item: ITaskScoreItem;
  onAddDispute: (value: any, itemId: string, disputId: string) => void,
  onDeleteDispute: (disputId: string) => void,
}

export const DisputeForm: React.FC<DisputeFormProps> = ({ item, onAddDispute, onDeleteDispute }) => {

  const [form] = Form.useForm()
  const [disputeID] = useState(`${item.id}${Date.now().toString()}` as string)

  const formStyle = {
    padding: '5px',
    marginBottom: '5px',
    background: '#fbfbfb',
    border: '1px solid #d9d9d9',
    borderRadius: '2px',
  }

  return (
    <Row>
      <Col flex='2 2 40%'>
        <Space direction="vertical" size="small">
          <Title level={5}>{item.id}</Title>
          <Text>{`Score: ${item.score}`}</Text>
          <Text type="secondary">{`Comment: ${item.comment}`}</Text>
        </Space>
      </Col>
      <Col flex='2 2 60%'>
        <Form form={form} style={formStyle} name={`Dispute${item.id}`} layout="vertical" size='small' onFinish={(value) => onAddDispute(value, item.id, disputeID)}>
          <Form.Item
            style={{marginBottom: '5px'}}
            name={`suggestedScore${item.id}`}
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
            style={{marginBottom: '5px'}}
            name={`comment${item.id}`}
            label="Comment"
            rules={[
              {
                required: false
              }
            ]}
          >
            <TextArea placeholder="Comment" autoSize />
          </Form.Item>
          <Form.Item style={{marginBottom: '5px'}}>
            <Button shape="circle" htmlType="submit" style={{marginRight: '5px'}} icon={<PlusOutlined />} />
            <Button shape="circle" icon={<MinusOutlined />} onClick={() => {
              form.resetFields();
              onDeleteDispute(disputeID)
              }} />
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}
