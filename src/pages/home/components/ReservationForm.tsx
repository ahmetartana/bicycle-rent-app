import { app } from '@brent/base';
import { BSubmitButton, BTextField } from '@brent/form-ui';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

const useStyles = makeStyles((theme: any) => ({
	message: {
		marginBottom: theme.spacing(2),
	},
	buttons: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
}));
const INITIAL_FORM_STATE = {
	startDate: '',
	endDate: '',
};

const DATE_VALIDATION = Yup.object().shape({
	startDate: Yup.string().required('Start Date is required'),
	endDate: Yup.string().required('End Date is required'),
});

export const ReservationForm = ({ bikeId }: { bikeId: string }) => {
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState('');
	const classes = useStyles();
	const history = useHistory();

	return (
		<Formik
			initialValues={INITIAL_FORM_STATE}
			validationSchema={DATE_VALIDATION}
			onSubmit={async (values) => {
				setLoading(true);
				setError('');
				const reservationDetail = {
					startDate: new Date(
						new Date(values.startDate).toUTCString()
					).getTime(),
					endDate: new Date(new Date(values.endDate).toUTCString()).getTime(),
					bikeId,
				};
				const callable = app.functions().httpsCallable('makeReservation');
				callable(reservationDetail)
					.then(({ data }) => {
						if (data.success) {
							setSuccess(
								'Success! You have reserved this bike, you will be redirected to reservations'
							);
							setTimeout(() => history.push('/reservations'), 3000);
						} else {
							setError(data.message);
							setLoading(false);
						}
					})
					.catch((err) => {
						setError(err.message);
						setLoading(false);
					});
			}}
		>
			<Form>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<BTextField
							fullWidth
							id='startDate'
							name='startDate'
							type='date'
							required
							label='Start Date'
							InputLabelProps={{ shrink: true }}
							size='small'
						></BTextField>
					</Grid>
					<Grid item xs={12} md={6}>
						<BTextField
							fullWidth
							required
							name='endDate'
							type='date'
							size='small'
							label='Start Date'
							InputLabelProps={{ shrink: true }}
							id='endDate'
						></BTextField>
					</Grid>
					<Grid item xs={12} className={classes.buttons}>
						<BSubmitButton
							color='primary'
							isloading={loading}
							loadingComponent={'Please wait...'}
							className={classes.buttons}
						>
							Reserve
						</BSubmitButton>
					</Grid>
					{error && (
						<Grid item xs={12} className={classes.message}>
							<Alert severity='error'>{error}</Alert>
						</Grid>
					)}
					{success && (
						<Grid item xs={12} className={classes.message}>
							<Alert severity='success'>{success}</Alert>
						</Grid>
					)}
				</Grid>
			</Form>
		</Formik>
	);
};
