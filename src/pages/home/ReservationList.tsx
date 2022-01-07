import { app } from '@brent/base';
import { IReservation } from '@brent/types';
import { ConfirmationDialog } from '@brent/ui';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TableContainer from '@material-ui/core/TableContainer';
import { DataGrid, GridRowId } from '@material-ui/data-grid';
import { Cancel } from '@material-ui/icons';
import StarRateIcon from '@material-ui/icons/StarRate';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { BikeScore } from './components/BikeScore';

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
			return new Date(row.endDate).toLocaleDateString();
		},
	},
];

export const ReservationList = () => {
	const [isScoringDialogOpen, setScoringDialogOpen] = React.useState(false);
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
	const [data, setData] = useState<IReservation[]>([]);
	const [refereshData, setRefereshData] = useState(false);
	const [selectedId, setSelectedId] = useState<GridRowId>();
	const [isDataLoading, setDataLoading] = useState(true);

	const history = useHistory();
	const classes = useStyles();

	useEffect(() => {
		setDataLoading(true);
		const callable = app.functions().httpsCallable('getMyReservations');
		callable({})
			.then(({ data }: { data: IReservation[] }) => {
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
						const callable = app.functions().httpsCallable('cancelReservation');
						callable({ reservationId: selectedId }).then(({ data }) => {
							setRefereshData((prev) => !prev);
						});
					}
					setSelectedId('');
					setIsConfirmDialogOpen(false);
				}}
				message='Are you sure you want to cancel your reservation?'
				open={isConfirmDialogOpen}
			></ConfirmationDialog>
			<Dialog
				fullScreen={false}
				open={isScoringDialogOpen}
				onClose={() => setScoringDialogOpen(false)}
				aria-labelledby='responsive-dialog-title'
			>
				<DialogContent>
					{selectedId && (
						<BikeScore reservationId={selectedId.toString()}></BikeScore>
					)}
				</DialogContent>
			</Dialog>
			<Grid item xs={12}>
				<Card>
					<CardHeader
						title='Reservation List'
						action={
							<div className={classes.topSpace}>
								<Button
									color='primary'
									variant='outlined'
									className={classes.rightSpace}
									size='small'
									disabled={!selectedId}
									startIcon={<StarRateIcon />}
									onClick={() => {
										setScoringDialogOpen(true);
									}}
								>
									Rate
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
									Cancel
								</Button>
							</div>
						}
					></CardHeader>
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
