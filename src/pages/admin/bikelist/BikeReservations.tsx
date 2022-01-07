import { app } from '@brent/base';
import { IBike } from '@brent/types';
import { ConfirmationDialog } from '@brent/ui';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { DataGrid, GridRowId } from '@material-ui/data-grid';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

const useStyles = makeStyles((theme: any) => ({
	flexend: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
	rightSpace: {
		marginRight: 20,
	},
	bottomSpace: {
		marginBottom: 20,
	},
}));

const columns = [
	{ field: 'id', headerName: 'ID', hide: true },
	{ field: 'firstName', headerName: 'First Name', flex: 0.3 },
	{ field: 'lastName', headerName: 'Last Name', flex: 0.3 },
	{ field: 'email', headerName: 'Email', flex: 0.3 },
	{
		field: 'startDate',
		headerName: 'Start Date',
		flex: 0.3,
		valueGetter: ({ row }: any) => {
			return new Date(row.startDate).toLocaleDateString();
		},
	},
	{
		field: 'endDate',
		headerName: 'End Date',
		flex: 0.3,
		valueGetter: ({ row }: any) => {
			return new Date(row.startDate).toLocaleDateString();
		},
	},
];

interface IBikeReservationParams {
	bikeId: string;
}
interface IBikeReservationData {
	id: string;
	startDate: string;
	endDate: string;
	firstName: string;
	lastName: string;
	email: string;
}

const BikeReservations = () => {
	const [data, setData] = useState<IBikeReservationData[]>([]);
	const [bike, setBike] = useState<IBike>();
	const [selectedId, setSelectedId] = useState<GridRowId>();
	const [isDataLoading, setDataLoading] = useState(true);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [refereshData, setRefereshData] = useState(false);
	const classes = useStyles();
	const { bikeId } = useParams<IBikeReservationParams>();

	const deleteSelectedItem = async (confirmation: boolean) => {
		{
			if (!confirmation) {
				setIsDialogOpen(false);
				return;
			}
			try {
				if (selectedId) {
					const callable = app.functions().httpsCallable('cancelReservation');
					await callable({ reservationId: selectedId });
				}
			} catch (error) {
			} finally {
				setRefereshData((prev) => !prev);
				setIsDialogOpen(false);
			}
		}
	};

	const getBikesReservation = async (id: string) => {
		const callable = app.functions().httpsCallable('getReservationsByBikeId');
		return callable({ bikeId: id }).then(({ data }) => {
			return data;
		});
	};

	useEffect(() => {
		setDataLoading(true);
		getBikesReservation(bikeId)
			.then((data) => {
				const { result, bike } = data;
				setData(result);
				setBike(bike);
			})
			.finally(() => {
				setDataLoading(false);
			});
	}, [refereshData]);

	return (
		<Grid container spacing={1}>
			<ConfirmationDialog
				onClose={deleteSelectedItem}
				message='This reservation will be cancelled. Are you sure?'
				open={isDialogOpen}
			></ConfirmationDialog>
			<Grid item xs={6} className={classes.bottomSpace}>
				{bike && (
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Photo</TableCell>
									<TableCell>Model</TableCell>
									<TableCell>Color</TableCell>
									<TableCell>Weight</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell>
										<img src={bike.photo} height={40}></img>
									</TableCell>
									<TableCell>{bike.model}</TableCell>
									<TableCell>{bike.color}</TableCell>
									<TableCell>{bike.weight}</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
				)}
			</Grid>
			<Grid item xs={12}>
				<Card>
					<CardContent className={classes.flexend}>
						<Button
							color='secondary'
							variant='outlined'
							size='small'
							disabled={!selectedId}
							onClick={() => {
								setIsDialogOpen(true);
							}}
						>
							Cancel Reservation
						</Button>
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
export default BikeReservations;
