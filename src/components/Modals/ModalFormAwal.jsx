import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Image,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Text,
} from '@chakra-ui/react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { priorityList as dataPriority } from '../../data/data-day';
import { IconArrowDown } from '../Icons/Icons';

export function ModalForm({ isOpen, onClose, onAction, data, type }) {
	const {
		handleSubmit,
		register,
		reset,
		setValue,
		formState: { dirtyFields },
		control,
	} = useForm({
		defaultValues: {
			title: '',
			priority: '',
		},
	});

	function onSubmit(values) {
		onAction({ ...values });
		reset();
	}

	React.useEffect(() => {
		if (data.id) {
			setValue('title', data.title);
			setValue('priority', data.priority);
		} else {
			reset();
		}
	}, [data]);

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent
				data-cy="modal-add"
				minW="830px"
				minH="403px"
				borderRadius="12px"
			>
				<form onSubmit={handleSubmit(onSubmit)}>
					<ModalHeader
						data-cy="modal-add-title"
						textStyle="h3"
						borderBottom={`1px solid #E5E5E5`}
						p={`30px 24px 19px`}
					>
						{type === 'edit' ? 'Edit Item' : 'Tambah List Item'}
					</ModalHeader>
					<ModalCloseButton
						data-cy="modal-add-close-button"
						top="25px"
						right="25px"
					/>

					<ModalBody p={`38px 30px 23px`}>
						<FormControl mb={26}>
							<FormLabel
								data-cy="modal-add-name-title"
								htmlFor="title"
								fontSize={'12px'}
								fontWeight={'semibold'}
							>
								NAMA LIST ITEM
							</FormLabel>
							<Input
								data-cy="modal-add-name-input"
								id="title"
								placeholder="Tambahkan nama list item"
								{...register('title', {
									required: true,
								})}
								height="52px"
								p={`14px 18px`}
								fontSize={'16px'}
								border={`1px solid #E5E5E5`}
								focusBorderColor="prime.900"
								borderRadius={'6px'}
							/>
						</FormControl>
						<FormControl width={'205px'}>
							<FormLabel
								data-cy="modal-add-priority-title"
								htmlFor="priority"
								fontSize={'12px'}
								fontWeight={'semibold'}
							>
								PRIORITY
							</FormLabel>
							<Controller
								name="priority"
								control={control}
								render={({
									field: { onChange, name, value },
								}) => (
									<Menu>
										<MenuButton
											data-cy="modal-add-priority-dropdown"
											as={Button}
											rightIcon={<IconArrowDown />}
											id="priority"
											bg="white"
											width="224px"
											height="52px"
											p={`14px 17px`}
											fontSize={'16px'}
											fontWeight="normal"
											border={`1px solid #E5E5E5`}
											borderRadius={'6px'}
											gap={'65px'}
											_expanded={{
												bg: 'white',
												borderColor: 'prime.900',
											}}
										>
											{value === '' ? (
												'Pilih priority'
											) : (
												<Box
													display={'inline-flex'}
													alignItems={'center'}
													gap={'19px'}
												>
													<Text
														as="span"
														display="inline-block"
														width="14px"
														height="14px"
														borderRadius="14px"
														backgroundColor={
															dataPriority.find(
																(priority) =>
																	priority.key ===
																	value
															).color
														}
													></Text>
													<Text
														fontSize={'16px'}
														fontWeight={'normal'}
													>
														{
															dataPriority.find(
																(priority) =>
																	priority.key ===
																	value
															).label
														}
													</Text>
												</Box>
											)}
										</MenuButton>
										<MenuList>
											{dataPriority.map((priority, i) => (
												<MenuItem
													data-cy="modal-add-priority-item"
													key={i}
													display="flex"
													justifyContent="space-between"
													alignItems="center"
													px="17px"
													py="14px"
													onClick={(_) => {
														onChange(priority.key);
													}}
													name={name}
													value={value}
												>
													<Box
														display="flex"
														alignItems="center"
														gap="19px"
													>
														<Text
															as="span"
															display="inline-block"
															width="14px"
															height="14px"
															borderRadius="14px"
															backgroundColor={
																priority.color
															}
														></Text>
														<Text
															fontSize={'16px'}
															fontWeight={
																'normal'
															}
														>
															{priority.label}
														</Text>
													</Box>
													{priority.key === value && (
														<Image src="/static/icons/checked.svg" />
													)}
												</MenuItem>
											))}
										</MenuList>
									</Menu>
								)}
							/>
						</FormControl>
					</ModalBody>

					<ModalFooter
						borderTop={`1px solid #E5E5E5`}
						p={`15px 24px 19px`}
					>
						<Button
							data-cy="modal-add-save-button"
							minW="150px"
							height="54px"
							bg={'prime.900'}
							color="white"
							borderRadius="45px"
							fontSize="18px"
							fontWeight="semibold"
							px="22px"
							py="13.5px"
							disabled={
								type === 'add' &&
								(!dirtyFields.title || !dirtyFields.day)
							}
							type="submit"
						>
							Simpan
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
}