import { app } from '@brent/base';
import { BSubmitButton, BTextField } from '@brent/form-ui';
import { Grid, Link as MLink } from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { AuthLayout } from '../layout';
import { authStyles } from '../styles';

const INITIAL_FORM_STATE = {
	email: '',
};

const FORM_VALIDATION = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Email is required'),
});

export const ForgotPassword = () => {
	const classes = authStyles();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	return (
		<AuthLayout title='Reset Password' Icon={LockOutlined}>
			<Formik
				initialValues={INITIAL_FORM_STATE}
				validationSchema={FORM_VALIDATION}
				onSubmit={async (values) => {
					setLoading(true);
					setError('');
					try {
						await app.auth().sendPasswordResetEmail(values.email);
						setSuccess(
							'Password reset link has been sent to your email. Please check your Inbox'
						);
					} catch (err) {
						setError(err.message);
					} finally {
						setLoading(false);
					}
				}}
			>
				<Form className={classes.form}>
					<BTextField
						fullWidth
						id='email'
						label='Email Address'
						name='email'
						autoComplete='email'
						autoFocus
						required
						margin='normal'
					/>

					<BSubmitButton
						isloading={loading}
						fullWidth
						color='primary'
						className={classes.submit}
						loadingComponent={'Please wait...'}
					>
						Send Email
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
							<MLink component={Link} to='/auth/signin'>
								Sign In
							</MLink>
							<span> or </span>
							<MLink component={Link} to='/auth/signup'>
								Register
							</MLink>
						</Grid>
					</Grid>
				</Form>
			</Formik>
		</AuthLayout>
	);
};
