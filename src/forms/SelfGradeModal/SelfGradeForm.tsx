import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/rootReducer';
import { SmileTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import { Spin, Space, Form, Button, Input, InputNumber, Typography, Divider } from 'antd';
import { Iprops } from './SelfGradeModal';
import { fetchTasks, saveTaskScoreResults } from 'src/store/reducers/selfGradeReducer';

const { Paragraph, Text } = Typography;
const { TextArea } = Input;

const inputStyle = {
	display: 'block',
	maxWidth: '300px',
	marginTop: '10px'
};

const validateMessages = {
	required: '${label} is required!',
	types: {
		number: '${label} is not a validate number!'
	},
	number: {
		range: '${label} must be between ${min} and ${max}'
	}
};

export const SelfGradeForm: React.FC<Iprops> = (props: any) => {
	const dispatch = useDispatch();
	useEffect(
		() => {
			dispatch(fetchTasks(props.taskId));
		},
		[ dispatch ]
	);
	const { task, loading } = useSelector((state: RootState) => state.selfGradeReducer);

	return loading ? (
		<Space>
			<Spin />
			<p>Task Loading...</p>
		</Space>
	) : (
		<React.Fragment>
			{task ? (
				task.items.map((item: any, i: number) => {
					return (
						<Form
							key={task.items.length - i}
							initialValues={{ remember: false }}
							validateMessages={validateMessages}
							onFinish={(values) => {
								values.item.id = item.id;
								dispatch(saveTaskScoreResults(values.item));
							}}
						>
							<Paragraph>
								<Text strong>{item.category}</Text>
							</Paragraph>
							<Paragraph>{item.title}</Paragraph>
							<Form.Item
								name={[ 'item', 'score' ]}
								label={`Score from ${item.minScore} to ${item.maxScore}`}
								rules={[
									{
										type: 'number',
										min: item.minScore,
										max: item.maxScore,
										required: true
									}
								]}
							>
								<InputNumber />
							</Form.Item>
							<Form.Item
								name={[ 'item', 'comment' ]}
								label="Comment"
								rules={[
									{
										required: false
									}
								]}
							>
								<TextArea placeholder="Comment" style={inputStyle} autoSize />
							</Form.Item>

							<Button htmlType="submit" icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}>
								Save this item
							</Button>
							<Divider />
						</Form>
					);
				})
			) : (
				<Paragraph>Close Modal and open later</Paragraph>
			)}
			<Button onClick={props.handleConfirmClick}>
				Confirm
				<SmileTwoTone />
			</Button>
		</React.Fragment>
	);
};
