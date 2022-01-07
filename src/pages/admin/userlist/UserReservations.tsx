import { app } from '@brent/base';
import { IUser } from '@brent/types';
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
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme: any) => ({
	flexend: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
	bottomSpace: {
		marginBottom: 20,
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

interface IUserReservationParams {
	uid: string;
}
interface IUserReservationData {
	id: string;
	startDate: string;
	endDate: string;
	model: string;
	color: string;
	weight: string;
	photo: string;
}

const UserReservations = () => {
	const [data, setData] = useState<IUserReservationData[]>([]);
	const [user, setUser] = useState<IUser>();
	const [selectedId, setSelectedId] = useState<GridRowId>();
	const [isDataLoading, setDataLoading] = useState(true);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [refereshData, setRefereshData] = useState(false);
	const classes = useStyles();
	const { uid } = useParams<IUserReservationParams>();

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

	const getUsersReservation = async (id: string) => {
		const callable = app.functions().httpsCallable('getReservationsByUserId');
		return callable({ userId: id }).then(({ data }) => {
			return data;
		});
	};

	useEffect(() => {
		setDataLoading(true);
		getUsersReservation(uid)
			.then((data) => {
				const { result, user } = data;
				setData(result);
				setUser(user);
			})
			.finally(() => {
				setDataLoading(false);
			});
	}, [refereshData]);

	return (
		<Grid container spacing={1}>
			<ConfirmationDialog
				onClose={deleteSelectedItem}
				message='This Reservation will be cancelled. Are you sure?'
				open={isDialogOpen}
			></ConfirmationDialog>
			<Grid item xs={12} className={classes.bottomSpace}>
				<Grid item xs={6}>
					{user && (
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>First Name</TableCell>
										<TableCell>Last Name</TableCell>
										<TableCell>Email</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow>
										<TableCell>{user.firstName}</TableCell>
										<TableCell>{user.lastName}</TableCell>
										<TableCell>{user.email}</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</Grid>
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
export default UserReservations;
