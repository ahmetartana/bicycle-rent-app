import { app } from '@brent/base';
import { BSelect, BSubmitButton } from '@brent/form-ui';
import { IBike } from '@brent/types';
import { ConfirmationDialog } from '@brent/ui';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TableContainer from '@material-ui/core/TableContainer';
import { DataGrid, GridRowId } from '@material-ui/data-grid';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: any) => ({
	flexend: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
	rightSpace: {
		marginRight: 20,
	},
}));

const columns = [
	{ field: 'id', headerName: 'ID', hide: true },
	{
		field: 'photo',
		headerName: 'Photo',
		flex: 0.3,
		renderCell: (params: any) => <img src={params.value} height={60}></img>,
	},
	{ field: 'model', headerName: 'Model', flex: 0.3 },
	{ field: 'color', headerName: 'Color', flex: 0.3 },
	{ field: 'weight', headerName: 'Weight', flex: 0.3 },
	{ field: 'isAvailable', headerName: 'Is Rentable', flex: 0.3 },
];

const INITIAL_FORM_STATE = {
	reservationStatus: 'all',
};

const BikeList = () => {
	const [data, setData] = useState<IBike[]>([]);
	const [selectedId, setSelectedId] = useState<GridRowId>();
	const [isDataLoading, setDataLoading] = useState(true);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [refereshData, setRefereshData] = useState(false);
	const [filter, setFilter] = useState('all');
	const history = useHistory();
	const classes = useStyles();

	const deleteSelectedItem = async (confirmation: boolean) => {
		{
			if (!confirmation) {
				setIsDialogOpen(false);
				return;
			}
			try {
				if (selectedId) {
					await app
						.firestore()
						.collection('bikes')
						.doc(selectedId.toString())
						.delete();
				}
			} catch (error) {
			} finally {
				setRefereshData((prev) => !prev);
				setIsDialogOpen(false);
			}
		}
	};

	const getBikesByFilter = async (filter: string) => {
		const callable = app.functions().httpsCallable('listBikeAdmin');
		return callable({ filter }).then(({ data }) => {
			return data as IBike[];
		});
	};

	useEffect(() => {
		setDataLoading(true);
		getBikesByFilter(filter)
			.then((result) => {
				setData(result);
			})
			.finally(() => {
				setDataLoading(false);
			});
	}, [refereshData]);

	return (
		<Grid container spacing={1}>
			<ConfirmationDialog
				onClose={deleteSelectedItem}
				message='This bike will be deleted forever. Are you sure?'
				open={isDialogOpen}
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
													label='Bike Status'
													name='reservationStatus'
													options={{
														all: 'All Bikes',
														onlyReserved: 'Reserved Only',
														notReserved: 'Not Reserved',
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
									onClick={() => history.push('/admin/bike/edit')}
								>
									Create
								</Button>
								<Button
									color='primary'
									variant='outlined'
									className={classes.rightSpace}
									size='small'
									disabled={!selectedId}
									onClick={() =>
										history.push(`/admin/bike/reservations/${selectedId}`)
									}
								>
									Reservations
								</Button>
								<Button
									variant='outlined'
									className={classes.rightSpace}
									size='small'
									disabled={!selectedId}
									onClick={() => history.push(`/admin/bike/edit/${selectedId}`)}
								>
									Update
								</Button>

								<Button
									color='secondary'
									variant='outlined'
									size='small'
									disabled={!selectedId}
									onClick={() => {
										setIsDialogOpen(true);
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
								setSelectedId(selectionModel[0]);
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

export default BikeList;
