import { app } from '@brent/base';
import { BSelect, BSubmitButton } from '@brent/form-ui';
import { IUser } from '@brent/types';
import { ConfirmationDialog } from '@brent/ui';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TableContainer from '@material-ui/core/TableContainer';
import { DataGrid } from '@material-ui/data-grid';
import { Cancel } from '@material-ui/icons';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: any) => ({
	flexend: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
	rightSpace: {
		marginRight: 20,
	},
	topSpace: {
		marginTop: 10,
	},
}));

const columns = [
	{ field: 'id', headerName: 'ID', hide: true },
	{ field: 'firstName', headerName: 'First Name', flex: 0.3 },
	{ field: 'lastName', headerName: 'Last Name', flex: 0.3 },
	{ field: 'email', headerName: 'Email', flex: 0.3 },
	{
		field: 'isAdmin',
		headerName: 'Role',
		flex: 0.3,
		valueGetter: ({ row }: any) => {
			return row.isAdmin ? 'Manager' : 'User';
		},
	},
];
const INITIAL_FORM_STATE = {
	reservationStatus: 'all',
};

const UserList = () => {
	const [data, setData] = useState<IUser[]>([]);
	const [selectedId, setSelectedId] = useState<string>();
	const [refereshData, setRefereshData] = useState(false);
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
	const [isDataLoading, setDataLoading] = useState(true);
	const [filter, setFilter] = useState('');
	const classes = useStyles();

	useEffect(() => {
		setDataLoading(true);
		const callable = app.functions().httpsCallable('listAllUsers');
		callable({ filter })
			.then(({ data }) => {
				setData(data);
			})
			.finally(() => {
				setDataLoading(false);
			});
	}, [refereshData]);

	return (
		<Grid container spacing={1}>
			<ConfirmationDialog
				onClose={async (confirmation) => {
					if (confirmation) {
						const callable = app.functions().httpsCallable('deleteUser');
						callable({ userId: selectedId })
							.then((result) => {})
							.finally(() => {
								setSelectedId('');
								setIsConfirmDialogOpen(false);
								setRefereshData((prev) => !prev);
							});
					}
					setSelectedId('');
					setIsConfirmDialogOpen(false);
				}}
				message='This user will be deleted forever. Are you sure?'
				open={isConfirmDialogOpen}
			></ConfirmationDialog>
			<Grid item xs={12}>
				<Card>
					<CardContent>
						<Grid container spacing={3}>
							<Grid item xs={7}>
								<Formik
									initialValues={INITIAL_FORM_STATE}
									onSubmit={(values) => {
										setFilter(values.reservationStatus);
										setRefereshData((val) => !val);
									}}
								>
									<Form>
										<Grid container>
											<Grid item xs={3}>
												<BSelect
													size='small'
													label='Reservation Status'
													name='reservationStatus'
													options={{
														all: 'All Users',
														onlyReserved: 'Who Reserved Bike',
														notReserved: "Who Didn't Reserve a Bike",
													}}
												></BSelect>
											</Grid>
											<Grid item xs={2} className={classes.flexend}>
												<BSubmitButton variant='outlined' size='small'>
													Apply Filter
												</BSubmitButton>
											</Grid>
										</Grid>
									</Form>
								</Formik>
							</Grid>
							<Grid item xs={5} className={classes.flexend}>
								<Button
									color='primary'
									variant='outlined'
									className={classes.rightSpace}
									size='small'
									component={Link}
									to={'/admin/user/edit'}
								>
									Create
								</Button>
								<Button
									color='primary'
									variant='outlined'
									className={classes.rightSpace}
									size='small'
									disabled={!selectedId}
									component={Link}
									to={`/admin/user/reservations/${selectedId}`}
								>
									Reservations
								</Button>
								<Button
									color='primary'
									variant='outlined'
									className={classes.rightSpace}
									size='small'
									disabled={!selectedId}
									component={Link}
									to={`/admin/user/edit/${selectedId}`}
								>
									Update
								</Button>
								<Button
									color='secondary'
									variant='outlined'
									size='small'
									disabled={!selectedId}
									startIcon={<Cancel />}
									onClick={() => {
										setIsConfirmDialogOpen(true);
									}}
								>
									Delete
								</Button>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</Grid>

			<Grid item xs={12}>
				<TableContainer component={Paper}>
					<DataGrid
						loading={isDataLoading}
						rowHeight={80}
						rows={data}
						columns={columns}
						autoHeight
						pageSize={10}
						onSelectionModelChange={({ selectionModel }) => {
							if (selectionModel && selectionModel.length) {
								setSelectedId(selectionModel[0].toString());
							} else {
								setSelectedId(undefined);
							}
						}}
					/>
				</TableContainer>
			</Grid>
		</Grid>
	);
};

export default UserList;
