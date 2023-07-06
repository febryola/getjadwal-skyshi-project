import { Box, Container, Text } from '@chakra-ui/react';

export default function Header({ title }) {
	return (
		<Box
			data-cy="header"
			bg="prime.900"
			height={105}
			display="flex"
			alignItems="center"
		>
			<Container maxW="5xl">
				<Text
					data-cy="header-title"
					textStyle="h2"
					
					color="white"
				>
					{title}
				</Text>
			</Container>
		</Box>
	);
}
