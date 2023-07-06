import {
	MenuList,
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
	Menu,
	MenuButton,
	MenuItem,

} from '@chakra-ui/react';
import { IconPlus, IconSort } from '../components/Icons/Icons';
import { ModalDelete, ModalForm } from '../components/Modals/Modals';
import TodoItem from '../components/TodoItem';
import { sortList as initialSortList } from '../data/data-sorting';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDetail, update as updateschedule } from '../server api/schedule';
import { destroy, store, update } from '../server api/schedule';


export default function Item() {
	let params = useParams();
	let { id } = params;
	const [todos, setTodos] = React.useState([]);
	const [changeTitle, setChangeTitle] = React.useState(false);
	const [sortList, setSortList] = React.useState(initialSortList);
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

	const handleChangeTitle = (e) => {
		setSchedule((schedule) => ({ ...schedule, title: e.target.value }));
	};

	const handleUpdateschedule = async () => {
		try {
			await updateschedule(id, schedule.title);
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

	const handleSort = (sortTitle) => {
		const tempTodo = todos;
		let result = [];

		if (sortTitle === 'Terbaru') {
			result = tempTodo.sort((a, b) => b.id - a.id);
		} else if (sortTitle === 'Terlama') {
			result = tempTodo.sort((a, b) => a.id - b.id);
		} else if (sortTitle === 'A-Z') {
			result = tempTodo.sort((a, b) => {
				if (a.title < b.title) return -1;
				if (a.title > b.title) return 1;
				return 0;
			});
		} else if (sortTitle === 'Z-A') {
			result = tempTodo.sort((a, b) => {
				if (a.title < b.title) return 1;
				if (a.title > b.title) return -1;
				return 0;
			});
		} else if (sortTitle === 'Belum Selesai') {
			result = tempTodo.sort((a, b) => b.is_active - a.is_active);
		}

		const newSortList = sortList.map((sort, i) => {
			if (sortTitle === sort.title) {
				return {
					...sort,
					isChecked: true,
				};
			} else {
				return {
					...sort,
					isChecked: false,
				};
			}
		});

		setTodos([...result]);
		setSortList(newSortList);
	};

	const handleCheck = async (idTodo) => {
		const idx = todos.findIndex((todo) => todo.id === idTodo);
		const tempTodo = todos;
		tempTodo[idx].is_active = !tempTodo[idx].is_active;
		setTodos([...tempTodo]);

		try {
			await update(tempTodo[idx].id, {
				is_active: tempTodo[idx].is_active,
			});
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
			const { data } = await getDetail('john@email.com','monday');
			const { todo_items, ...schedule } = data;
			setSchedule({ ...schedule });
			setTodos([...todo_items]);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	}, [id]);

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
					{changeTitle ? (
						<Input
							autoFocus
							variant="flushed"
							width="md"
							fontSize="36px"
							fontWeight="bold"
							lineHeight="54px"
							focusBorderColor="#111111"
							value={schedule.title}
							onChange={(e) => handleChangeTitle(e)}
							onBlur={handleUpdateschedule}
						/>
					) : (
						<Text
							data-cy="detail-title"
							textStyle="h1"
							onClick={() => setChangeTitle(true)}
						>
							{schedule.title}
						</Text>
					)}
					<Image
						data-cy="todo-title-edit-button"
						src="/static/icons/todo-title-edit-button.svg"
						alt="todo-title-edit-button"
						width="24px"
						cursor="pointer"
						onClick={() => setChangeTitle(true)}
					/>
				</Box>
				<Box display="flex" gap="18px">
					<Menu>
						<MenuButton
							data-cy="todo-sort-button"
							as={IconButton}
							icon={<IconSort />}
							colorScheme="grey"
							aria-label="sort"
							w="54px"
							h="54px"
							border={`1px solid #E5E5E5`}
							borderRadius="50%"
						/>
						<MenuList width="235px">
							{sortList.map((sort, i) => (
								<MenuItem
									data-cy={`sort-selection`}
									key={sort.title}
									display="flex"
									justifyContent="space-between"
									alignItems="center"
									px="21px"
									py="17px"
									onClick={() => handleSort(sort.title)}
								>
									<Box display="flex" alignItems="center">
										<Image
											data-cy="sort-selection-icon"
											src={sort.icon}
											mr="15px"
											width="18px"
											height="18px"
										/>
										<Text data-cy="sort-selection-title">
											{sort.title}
										</Text>
									</Box>
									{sort.isChecked && (
										<Image src="/static/icons/checked.svg" />
									)}
								</MenuItem>
							))}
						</MenuList>
					</Menu>
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
							schedule berhasil dihapus
						</Text>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}
