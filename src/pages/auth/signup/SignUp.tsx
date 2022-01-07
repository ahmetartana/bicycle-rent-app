import { app, useAuth } from '@brent/base';
import { BSubmitButton, BTextField } from '@brent/form-ui';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Alert from '@material-ui/lab/Alert';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { Link as RLink, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { AuthLayout } from '../layout';
import { authStyles } from '../styles';

const INITIAL_FORM_STATE = {
	firstName: '',
	lastName: '',
	email: '',
	password: '',
	passwordConfirm: '',
};

const FORM_VALIDATION = Yup.object().shape({
	firstName: Yup.string().required('First name is required'),
	lastName: Yup.string().required('Last name is required'),
	email: Yup.string().email('Invalid email').required('Email is required'),
	password: Yup.string()
		.test('password', 'Must be at least 6 characters', (val) => {
			// some typescript issues
			if (!val) {
				return true;
			}
			return val.length > 5;
		})
		.required('Password is required'),
	passwordConfirm: Yup.string().oneOf(
		[Yup.ref('password'), null],
		'Password must match'
	),
});

export const SignUp = () => {
	const classes = authStyles();
	const [error, setError] = useState('');
	const [isLoading, setLoading] = useState(false);
	const { signUp } = useAuth();
	const history = useHistory();
	return (
		<AuthLayout title='Sign Up' Icon={LockOutlinedIcon}>
			<Formik
				initialValues={INITIAL_FORM_STATE}
				validationSchema={FORM_VALIDATION}
				onSubmit={async (values) => {
					setError('');
					setLoading(true);
					try {
						const user = await signUp({
							email: values.email,
							password: values.password,
						});
						await app
							.firestore()
							.collection('userprofile')
							.doc(user.user?.uid)
							.set({
								firstName: values.firstName,
								lastName: values.lastName,
								email: values.email,
							});
						history.push('/');
					} catch (err) {
						setError(err.message);
						setLoading(false);
					}
				}}
			>
				<Form className={classes.form}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<BTextField
								autoComplete='fname'
								name='firstName'
								variant='outlined'
								required
								fullWidth
								id='firstName'
								label='First Name'
								margin='normal'
								autoFocus
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<BTextField
								variant='outlined'
								required
								fullWidth
								id='lastName'
								label='Last Name'
								name='lastName'
								margin='normal'
								autoComplete='lname'
							/>
						</Grid>
						<Grid item xs={12}>
							<BTextField
								variant='outlined'
								required
								fullWidth
								id='email'
								label='Email Address'
								name='email'
								margin='normal'
								autoComplete='email'
							/>
						</Grid>

						<Grid item xs={12}>
							<BTextField
								variant='outlined'
								required
								fullWidth
								name='password'
								label='Password'
								type='password'
								margin='normal'
								id='password'
								autoComplete='current-password'
							/>
						</Grid>
						<Grid item xs={12}>
							<BTextField
								variant='outlined'
								required
								fullWidth
								name='passwordConfirm'
								label='Confirm Password'
								type='password'
								margin='normal'
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
						Sign Up
					</BSubmitButton>
					{error && (
						<Grid item xs={12} className={classes.message}>
							<Alert severity='error'>{error}</Alert>
						</Grid>
					)}
					<Grid container>
						<Grid item>
							<Link component={RLink} to='/auth/signin'>
								Already have an account? Sign In
							</Link>
						</Grid>
					</Grid>
				</Form>
			</Formik>
		</AuthLayout>
	);
};
