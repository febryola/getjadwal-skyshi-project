import { Box } from '@chakra-ui/react';
import React from 'react';

export default function Cards({ children, dataCy, handleClick = () => {} }) {
	return (
		<Box
			data-cy={dataCy}
			maxW="235px"
			height="234px"
			display="flex"
			flexDirection="column"
			justifyContent="space-between"
			px="27px"
			py="22px"
			bg="white"
			boxShadow={`0px 6px 10px rgba(0, 0, 0, .1)`}
			borderRadius="12px"
			cursor="pointer"
			onClick={handleClick}
		>
			{children}
		</Box>
	);
}
