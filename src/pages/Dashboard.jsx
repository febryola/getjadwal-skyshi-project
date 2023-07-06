import {
	Box,
	Button,
	Grid,
	Image,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	Spinner,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { IconPlus } from '../components/Icons/Icons';
import Cards from '../components/Cards';
import { useNavigate } from 'react-router-dom';
import { ModalDelete } from '../components/Modals/Modals';
import { destroy, getAll, store } from '../server api/schedule';

export default function Dashboard() {
	const [dataSchedule, setDataSchedule] = React.useState([]);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [loading, setLoading] = React.useState(true);
	const {
		isOpen: isOpenAlert,
		onOpen: onOpenAlert,
		onClose: onCloseAlert,
	} = useDisclosure();
	let navigate = useNavigate();

	const handleAdd = async () => {
		try {
			await store('john@email.com');
			await getActivities();
		} catch (error) {
			console.log(error);
		}
	};

	const getActivities = React.useCallback(async () => {
	try {
		const { data } = await getAll("john@email.com");
		setDataSchedule(data.data);
		setLoading(false);
	} catch (error) {
		setLoading(false);
		console.log(error);
	}
	}, []);

	React.useEffect(() => {
		getActivities();
	}, [getActivities]);

	return (
		<>
			<Box
				marginTop="43px"
				marginBottom="59px"
				display="flex"
				justifyContent="space-between"
			>
				<Text data-cy="activity-title" textStyle="h1">
					
				</Text>
				<Button
					data-cy="btn-create-schedule"
					minW="150px"
					height="54px"
					bg={'#D9019C'}
					color="white"
					borderRadius="45px"
					fontSize="18px"
					fontWeight="semibold"
					px="22px"
					py="13.5px"
					leftIcon={<IconPlus />}
					onClick={handleAdd}
				>
					Buat Jadwal Kuliah
				</Button>
			</Box>
			{loading ? (
				<Box display="flex" justifyContent="center">
					<Spinner color="prime.900" size="lg" />
				</Box>
			) : (
				<Grid
					templateColumns={
						Object.keys(dataSchedule).length > 0 ? `repeat(5, 1fr)` : '1fr'
					}
					rowGap="26px"
					columnGap="20px"
					marginBottom="50px"
					>
					{Object.keys(dataSchedule).map((day) => (
						<Cards
						dataCy={`card-day-${day}`}
						handleClick={() => navigate(`/schedule/${dataSchedule[day][0].id}`)}
						key={day}
						>
						<Text data-cy={`card-title-${day}`} textStyle="h3">
							{day.charAt(0).toUpperCase() + day.slice(1)}
						</Text>
						<Box
							display="inline-flex"
							justifyContent="space-between"
							alignItems="center"
							bg="white"
						>
							{dataSchedule[day].length > 0 ? (
							dataSchedule[day].map((data) => (
								<Text
								data-cy={`card-desc-${data.title}`}
								key={data.id}
								as="span"
								fontSize="14px"
								fontWeight="medium"
								color="#888888"
								cursor="text"
								>
								{data.title}
								</Text>
							))
							) : (
							<Text
								data-cy={`card-desc-${day}`}
								as="span"
								fontSize="14px"
								fontWeight="medium"
								color="#888888"
								cursor="text"
							>
								Belum ada mata kuliah
							</Text>
							)}
						</Box>
						</Cards>
					))}
					</Grid>
			)}
		</>
	);
}
