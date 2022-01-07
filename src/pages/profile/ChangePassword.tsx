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
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import firebase from 'firebase';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	marginBottom: {
		marginBottom: theme.spacing(3),
	},
}));

const INITIAL_FORM_STATE = {
	oldPassword: '',
	password: '',
	passwordConfirm: '',
};

interface IUserEdit {
	password: string;
	passwordConfirm: string;
}

const FORM_VALIDATION = Yup.object().shape({
	oldPassword: Yup.string().required('Old Password is required'),
	password: Yup.string().required('New password is required'),
	passwordConfirm: Yup.mixed().when('password', {
		is: (val: any) => val === undefined,
		then: Yup.mixed().notRequired(),
		otherwise: Yup.string()
			.required('Password must match')
			.oneOf([Yup.ref('password')], 'Password must match'),
	}),
});

const reauthenticate = (currentPassword: string) => {
	const user = app.auth().currentUser;
	if (user != null) {
		const cred = firebase.auth.EmailAuthProvider.credential(
			user.email!,
			currentPassword
		);
		return user.reauthenticateWithCredential(cred);
	}
	return Promise.reject('User not available');
};

export const ChangePassword = () => {
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isLoading, setLoading] = useState(false);
	const history = useHistory();
	const search = useLocation().search;
	const oobCode = new URLSearchParams(search).get('oobCode');
	const classes = useStyles();
	useEffect(() => {}, []);
	return (
		<Container component='main' maxWidth='xs'>
			<div className={classes.paper}>
				<Formik
					initialValues={INITIAL_FORM_STATE}
					validationSchema={FORM_VALIDATION}
					onSubmit={async (values) => {
						setError('');
						setLoading(true);
						try {
							await reauthenticate(values.oldPassword);
							const user = firebase.auth().currentUser;
							await user!.updatePassword(values.password);
							setSuccess('Your password has been updated');
						} catch (err) {
							setError(err.message);
						} finally {
							setLoading(false);
						}
					}}
				>
					<Form>
						<Grid container spacing={2} className={classes.marginBottom}>
							<Grid item xs={12}>
								<BTextField
									variant='outlined'
									required
									fullWidth
									margin='normal'
									name='oldPassword'
									label='Old Password'
									type='password'
									id='oldPassword'
									autoComplete='current-password'
								/>
							</Grid>
							<Grid item xs={12}>
								<BTextField
									variant='outlined'
									required
									fullWidth
									margin='normal'
									name='password'
									label='New Password'
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
									label='Confirm New Password'
									type='password'
									id='passwordConfirm'
								/>
							</Grid>
						</Grid>
						<BSubmitButton
							fullWidth
							variant='outlined'
							color='primary'
							isloading={isLoading}
							className={classes.marginBottom}
							loadingComponent={'Please wait...'}
						>
							Change Password
						</BSubmitButton>
						{error && (
							<Grid item xs={12}>
								<Alert severity='error'>{error}</Alert>
							</Grid>
						)}
						{success && (
							<Grid item xs={12}>
								<Alert severity='success'>{success}</Alert>
							</Grid>
						)}
					</Form>
				</Formik>
			</div>
		</Container>
	);
};
