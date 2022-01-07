import { app, useAuth } from '@brent/base';
import { BSubmitButton, BTextField } from '@brent/form-ui';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Alert from '@material-ui/lab/Alert';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { Link as RLink, useHistory, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { AuthLayout } from '../layout';
import { authStyles } from '../styles';

const INITIAL_FORM_STATE = {
	password: '',
	passwordConfirm: '',
};

const FORM_VALIDATION = Yup.object().shape({
	password: Yup.string().required('Password is required'),
	passwordConfirm: Yup.mixed().when('password', {
		is: (val: any) => val === undefined,
		then: Yup.mixed().notRequired(),
		otherwise: Yup.string()
			.required('Password must match')
			.oneOf([Yup.ref('password')], 'Password must match'),
	}),
});

export const ResetPassword = () => {
	const classes = authStyles();
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isLoading, setLoading] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const history = useHistory();
	const search = useLocation().search;
	const oobCode = new URLSearchParams(search).get('oobCode');

	useEffect(() => {
		if (oobCode) {
			app
				.auth()
				.verifyPasswordResetCode(oobCode)
				.then((email) => {
					setShowForm(true);
				})
				.catch((err) => {
					history.push('/auth/signin');
				});
		}
	}, []);
	return (
		<AuthLayout title='Reset Password' Icon={LockOutlinedIcon}>
			{showForm && (
				<Formik
					initialValues={INITIAL_FORM_STATE}
					validationSchema={FORM_VALIDATION}
					onSubmit={async (values) => {
						setError('');
						setLoading(true);
						try {
							await app.auth().confirmPasswordReset(oobCode!, values.password);
							setSuccess(
								'Your password has been reset successfully, you will be redirected to loign.'
							);
							setTimeout(() => history.push('/auth/signin'), 3000);
						} catch (err) {
							setError(err.message);
							setLoading(false);
						}
					}}
				>
					<Form className={classes.form}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<BTextField
									variant='outlined'
									required
									fullWidth
									margin='normal'
									name='password'
									label='Password'
									type='password'
									id='password'
									autoComplete='current-password'
								/>
							</Grid>
							<Grid item xs={12}>
								<BTextField
									variant='outlined'
									required
									margin='normal'
									fullWidth
									name='passwordConfirm'
									label='Confirm Password'
									type='password'
									id='passwordConfirm'
								/>
							</Grid>
						</Grid>
						<BSubmitButton
							fullWidth
							variant='contained'
							color='primary'
							className={classes.submit}
							isloading={isLoading}
							loadingComponent={'Please wait...'}
						>
							Update Password
						</BSubmitButton>
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
						<Grid container>
							<Grid item>
								<Link component={RLink} to='/auth/signin'>
									Sign In
								</Link>
								<span> or </span>
								<Link component={RLink} to='/auth/signup'>
									Register
								</Link>
							</Grid>
						</Grid>
					</Form>
				</Formik>
			)}
		</AuthLayout>
	);
};
