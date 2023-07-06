import { Box, Checkbox, Image, Text } from '@chakra-ui/react';
import React from 'react';

export default function TodoItem({
	dataCy,
	id: idTodo,
	is_active,
	title,
	schedule_group_id,
	handleCheck,
	handleDelete,
	handleEdit,
}) {
	return (
		<Box
			data-cy={dataCy}
			height="80px"
			bg="#FFFFFF"
			boxShadow={`0px 6px 10px rgba(0, 0, 0, .1)`}
			borderRadius="12px"
			display="flex"
			justifyContent="space-between"
			alignItems="center"
			p="28px"
			mb="10px"
		>
			<Box display="flex" gap="16px" alignItems="center">
				<Text
					data-cy="todo-item-title"
					textStyle="h3"
					fontWeight="medium"
					color={!is_active && '#888888'}
					textDecoration={!is_active ? 'line-through' : 'none'}
				>
					{title}
				</Text>
				<Image
					data-cy="todo-item-edit-button"
					src="/static/icons/todo-title-edit-button.svg"
					alt="todo-item-edit-button"
					width="20px"
					opacity={0.6}
					cursor="pointer"
					onClick={handleEdit}
				/>
			</Box>
			<Image
				data-cy="todo-item-delete-button"
				src="/static/icons/delete.svg"
				alt="todo-item-delete-button"
				cursor="pointer"
				onClick={() =>
					handleDelete({
						schedule_group_id,
						id: idTodo,
						title,
					})
				}
			/>
		</Box>
	);
}
