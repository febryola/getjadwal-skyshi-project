import {
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	Spinner,
	Text,
	useDisclosure,
	Box,
	Button,
	IconButton,
	Image,
	Input,

} from '@chakra-ui/react';
import { IconPlus, IconSort } from '../components/Icons/Icons';
import { ModalDelete, ModalForm } from '../components/Modals/Modals';
import TodoItem from '../components/TodoItem';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDetail, update as updateschedule } from '../server api/schedule';
import { destroy, store, update } from '../server api/schedule';
export default function Item() {
	let params = useParams();
	let { day } = params;
	console.log(day);
	const [todos, setTodos] = React.useState([]);
	const [loading, setLoading] = React.useState(true);
	const [schedule, setSchedule] = React.useState({});
	const [todoSelected, setTodoSelected] = React.useState({});
	const {
		isOpen: isOpenAlert,
		onOpen: onOpenAlert,
		onClose: onCloseAlert,
	} = useDisclosure();
	const {
		isOpen: isOpenModalDelete,
		onOpen: onOpenModalDelete,
		onClose: onCloseModalDelete,
	} = useDisclosure();
	const {
		isOpen: isOpenModalForm,
		onOpen: onOpenModalForm,
		onClose: onCloseModalForm,
	} = useDisclosure();

	let navigate = useNavigate();

	const dayNames = {
		monday: 'Senin',
		tuesday: 'Selasa',
		wednesday: 'Rabu',
		thursday: 'Kamis',
		friday: 'Jumat',
		};

	const handleUpdateschedule = async () => {
		try {
			await updateschedule(day, schedule.data[0].day);
			setChangeTitle(false);
		} catch (error) {
			console.log(error);
		}
	};

	const handleClickDelete = (data) => {
		setTodoSelected(data);
		onOpenModalDelete();
	};

	const handleDelete = async () => {
		onCloseModalDelete();
		try {
			await destroy(todoSelected.id);
			await getDetailSchedule();
			onOpenAlert();
		} catch (error) {
			console.log(error);
		}
	};

	const handleModalForm = (data) => {
		setTodoSelected(data);
		onOpenModalForm();
	};

	const handleActionModalForm = async (dataForm) => {
		onCloseModalForm();
		try {
			if (todoSelected.id) await update(todoSelected.id, dataForm);
			else
				await store({
					...dataForm,
					schedule_group_id: id,
				});
			await getDetailSchedule();
		} catch (error) {
			console.log(error);
		}
	};

	const getDetailSchedule = React.useCallback(async () => {
		try {
			const { data } = await getDetail('john@email.com', day);
			const { todos, ...schedule } = data;
			setSchedule({ ...schedule });
			setTodos( ...todos); 
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
		}, [day]);

		console.log("hei",todos);
	React.useEffect(() => {
		getDetailSchedule();
	}, [getDetailSchedule]);

	return (
		<>
			<Box
				marginTop="43px"
				marginBottom="59px"
				display="flex"
				justifyContent="space-between"
			>
				<Box display="flex" gap="19px" alignItems="center">
					<Image
						data-cy="btn-back"
						src="/static/icons/todo-back-button.svg"
						alt="todo-back-button"
						width="24px"
						cursor="pointer"
						onClick={() => navigate(-1)}
					/>
						<Text
							data-cy="detail-title"
							textStyle="h1"
							onClick={() => setChangeTitle(true)}
						>
							{dayNames[day]}
						</Text>
				</Box>
				<Box display="flex" gap="18px">
					
					<Button
						data-cy="todo-add-button"
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
						onClick={() => handleModalForm({})}
					>
						Tambah
					</Button>
				</Box>
			</Box>
			{loading ? (
				<Box display="flex" justifyContent="center">
					<Spinner color="prime.900" size="lg" />
				</Box>
			) : (
				<Box data-cy="todo-item" marginBottom="50px">
					{todos.length > 0 ? (
						todos.map((data, i) => (
							<TodoItem
								dataCy={`todo-item-${i}`}
								key={data.id}
								handleCheck={handleCheck}
								{...data}
								handleDelete={handleClickDelete}
								handleEdit={() => handleModalForm(data)}
							/>
						))
					) : (
						<Box
							data-cy="todo-empty-state"
							display="flex"
							justifyContent="center"
						>
							<Image
								src="/assets/todo-empty-state.png"
								alt="todo-empty-state"
								onClick={() => handleModalForm({})}
							/>
						</Box>
					)}
				</Box>
			)}
			<ModalDelete
				isOpen={isOpenModalDelete}
				onClose={onCloseModalDelete}
				onAction={handleDelete}
				content={`Apakah anda yakin menghapus List Item<br />
				<strong>“${todoSelected?.title}”?</strong>`}
			/>
			<ModalForm
				isOpen={isOpenModalForm}
				onClose={onCloseModalForm}
				onAction={handleActionModalForm}
				data={todoSelected}
				type={Object.keys(todoSelected).length ? 'edit' : 'add'}
			/>
			<Modal
				data-cy="modal-information"
				isOpen={isOpenAlert}
				onClose={onCloseAlert}
				isCentered
			>
				<ModalOverlay />
				<ModalContent
					data-cy="modal-information"
					minH={'58px'}
					minW="490px"
				>
					<ModalBody display="flex" alignItems={'center'}>
						<Image
							data-cy="modal-information-icon"
							src="/static/icons/modal-information-icon.svg"
							alt="modal-information-icon"
							mr="10px"
						/>
						<Text
							data-cy="modal-information-title"
							fontSize="14px"
							fontWeight="medium"
							color="#111111"
						>
							Schedule berhasil dihapus
						</Text>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}
