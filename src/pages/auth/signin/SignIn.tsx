import { useAuth } from '@brent/base';
import { BCheckbox, BSubmitButton, BTextField } from '@brent/form-ui';
import { Grid, Link as MLink } from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { AuthLayout } from '../layout';
import { authStyles } from '../styles';

const INITIAL_FORM_STATE = {
	email: '',
	password: '',
	rememberMe: false,
};

const FORM_VALIDATION = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Email is required'),
	password: Yup.string().required('Password is required'),
});

export const SignIn = () => {
	const classes = authStyles();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState('');
	const history = useHistory();
	const { signIn, currentUser } = useAuth();
	return (
		<AuthLayout title='Sign in' Icon={LockOutlined}>
			<Formik
				initialValues={INITIAL_FORM_STATE}
				validationSchema={FORM_VALIDATION}
				onSubmit={async (values) => {
					setLoading(true);
					setError('');
					try {
						await signIn({ ...values });
						history.push('/');
					} catch (err) {
						setLoading(false);
						setError(err.message);
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
					<BTextField
						margin='normal'
						fullWidth
						required
						name='password'
						label='Password'
						type='password'
						id='password'
						autoComplete='current-password'
					/>
					<BCheckbox id='rememberMe' label='Remember me' name='rememberMe' />

					<BSubmitButton
						isloading={loading}
						fullWidth
						color='primary'
						className={classes.submit}
						loadingComponent={'Please wait...'}
					>
						Sign In
					</BSubmitButton>

					{error && (
						<Grid item xs={12} className={classes.message}>
							<Alert severity='error'>{error}</Alert>
						</Grid>
					)}
					<Grid container>
						<Grid item xs>
							<MLink component={Link} to='/auth/forgotpassword' variant='body2'>
								Forgot password?
							</MLink>
						</Grid>
						<Grid item>
							<MLink component={Link} to='/auth/signup' variant='body2'>
								{"Don't have an account? Sign Up"}
							</MLink>
						</Grid>
					</Grid>
				</Form>
			</Formik>
		</AuthLayout>
	);
};
