import { app } from '@brent/base';
import { BCheckbox, BSubmitButton, BTextField } from '@brent/form-ui';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
	buttons: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
	button: {
		marginTop: theme.spacing(3),
		marginLeft: theme.spacing(1),
	},
	spaceBottom: {
		marginBottom: theme.spacing(3),
	},
}));

const INITIAL_FORM_STATE = {
	firstName: '',
	lastName: '',
	email: '',
	password: '',
	passwordConfirm: '',
	isAdmin: false,
};

interface IUserEdit {
	uid?: string;
	firstName: string;
	lastName: string;
	email: string;
	password?: string;
	passwordConfirm?: string;
	isAdmin: boolean;
}

const FORM_VALIDATION = Yup.object().shape({
	firstName: Yup.string().required('First name is required'),
	lastName: Yup.string().required('Last name is required'),
	email: Yup.string().email('Invalid email').required('Email is required'),
	password: Yup.mixed().when('uid', {
		is: (val: any) => val === undefined,
		then: Yup.string()
			.test('password', 'Must be at least 6 characters', (val) => {
				// some typescript issues
				if (!val) {
					return true;
				}
				return val.length > 5;
			})
			.required('Password is required'),
		otherwise: Yup.mixed().notRequired(),
	}),
	passwordConfirm: Yup.mixed().when('password', {
		is: (val: any) => val === undefined,
		then: Yup.mixed().notRequired(),
		otherwise: Yup.string()
			.required('Password must match')
			.oneOf([Yup.ref('password')], 'Password must match'),
	}),
});

const saveUserData = async (values: IUserEdit) => {
	try {
		const callable = app.functions().httpsCallable('createOrUpdateUser');
		const { uid, firstName, lastName, email, password, isAdmin } = values;
		const { data } = await callable({
			uid,
			firstName,
			lastName,
			email,
			password,
			isAdmin,
		});
		const message = `User ${
			uid ? 'updated' : 'created'
		} successfully. You may continue editing`;
		return Promise.resolve({ message, data });
	} catch (err) {
		return Promise.reject(err);
	}
};

const UserEdit = () => {
	const classes = useStyles();
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isLoading, setLoading] = useState(false);
	const [user, setUser] = useState<IUserEdit>();
	const history = useHistory();
	const { uid } = useParams<any>();
	const [loadingData, setLoadingData] = useState(true);

	const onFormSubmit = async (values: IUserEdit) => {
		setError('');
		setSuccess('');
		setLoading(true);
		saveUserData(values)
			.then(({ message, data }) => {
				setSuccess(message);
				if (!uid) {
					history.push(`/admin/user/edit/${data}`);
				}
			})
			.catch((err) => {
				setError(err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		if (uid) {
			const callable = app.functions().httpsCallable('getUserById');
			callable({ uid })
				.then(({ data }) => {
					setUser({ ...data, password: '', passwordConfirm: '' });
					setLoadingData(false);
				})
				.catch((err) => {
					setError(err.message);
				});
		} else {
			setLoadingData(false);
		}
	}, [uid]);
	return (
		<Grid container>
			<Grid item xs={6}>
				<Formik
					enableReinitialize={true}
					initialValues={user || INITIAL_FORM_STATE}
					validationSchema={FORM_VALIDATION}
					onSubmit={onFormSubmit}
				>
					<Card>
						<CardHeader title='Fill in User detail'></CardHeader>
						<CardContent>
							{error && (
								<Grid item xs={12} className={classes.spaceBottom}>
									<Alert severity='error'>{error}</Alert>
								</Grid>
							)}
							{success && (
								<Grid item xs={12} className={classes.spaceBottom}>
									<Alert severity='success'>{success}</Alert>
								</Grid>
							)}
							{!loadingData && (
								<Form>
									<Grid container spacing={3}>
										<Grid item xs={12} sm={6}>
											<BTextField
												autoComplete='fname'
												name='firstName'
												variant='outlined'
												required
												fullWidth
												id='firstName'
												label='First Name'
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
												id='passwordConfirm'
											/>
										</Grid>
										<Grid item xs={12}>
											<BCheckbox id='isAdmin' label='Is Admin' name='isAdmin' />
										</Grid>
									</Grid>

									<div className={classes.buttons}>
										<BSubmitButton
											variant='contained'
											color='primary'
											isloading={isLoading}
											loadingComponent={'Please wait...'}
										>
											{uid ? 'Update User' : 'Create Account'}
										</BSubmitButton>
									</div>
								</Form>
							)}
						</CardContent>
					</Card>
				</Formik>
			</Grid>
		</Grid>
	);
};
export default UserEdit;
