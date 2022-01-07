import { app, db } from '@brent/base';
import {
	BCheckbox,
	BFileUpload,
	BLocationSelect,
	BSelect,
	BSubmitButton,
	BTextField,
} from '@brent/form-ui';
import { IBike } from '@brent/types';
import { Card, CardContent, CardHeader } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import firebase from 'firebase/app';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
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

type BikeParams = {
	id?: string;
};

interface IFormState {
	id?: string;
	model: string;
	color: string;
	weight: string;
	location?: { lat: number; lng: number };
	isAvailable: boolean;
	photo?: any;
	photoUrl: string;
}

const INITIAL_FORM_STATE: IFormState = {
	model: '',
	color: '',
	weight: '',
	location: undefined,
	isAvailable: false,
	photo: undefined,
	photoUrl: '',
};

const FORM_VALIDATION = Yup.object().shape({
	model: Yup.string().required('Model is required'),
	color: Yup.string().required('Color is required'),
	weight: Yup.number()
		.typeError('Weight is not valid')
		.required('Color is required'),

	photo: Yup.mixed().test('photo', 'Image is required', function (value: any) {
		if (value) {
			return true;
		}
		const { photoUrl } = this.parent;
		if (photoUrl) {
			return true;
		}
		return false;
	}),
	location: Yup.mixed().required('Location is required'),
});

const getBikeById = async (id: string) => {
	return db
		.collection('bikes')
		.doc(id)
		.get()
		.then((snapshot) => {
			const data = snapshot.data();
			if (data) {
				const bike = data as IBike;
				const response = {
					id,
					model: bike.model,
					color: bike.color,
					weight: bike.weight,
					location: {
						lat: bike.location.latitude,
						lng: bike.location.longitude,
					},
					isAvailable: bike.isAvailable,
					photoUrl: bike.photo,
				};
				return response;
			} else {
				return Promise.reject({ message: 'Could not find data' });
			}
		});
};

const saveBikeData = async (values: IFormState) => {
	let url = values.photoUrl;
	if (values.photo) {
		const storageRef = app.storage().ref();
		const fileRef = storageRef.child(`${uuidv4()}-${values.photo.name}`);
		await fileRef.put(values.photo);
		url = await fileRef.getDownloadURL();
	}
	const bike: IBike = {
		model: values.model,
		color: values.color,
		weight: values.weight,
		photo: url,
		location: new firebase.firestore.GeoPoint(
			values.location?.lat!,
			values.location?.lng!
		),
		isAvailable: values.isAvailable,
	};
	try {
		if (values.id) {
			await db.collection('bikes').doc(values.id).update(bike);
			return Promise.resolve({
				data: bike,
				message:
					'Bike has been updated successfully, you may continue editing the record',
			});
		} else {
			bike.score = 0;
			bike.totalScore = 0;
			const res = await db.collection('bikes').add(bike);
			return Promise.resolve({
				data: res,
				message:
					'Bike has been created successfully, you may continue editing the record',
			});
		}
	} catch (err) {
		return Promise.reject(err);
	}
};

const BikeEdit = () => {
	const classes = useStyles();
	const history = useHistory();
	const { id } = useParams<BikeParams>();
	const [bike, setBike] = useState<IFormState>();
	const [isLoading, setIsLoading] = useState(false);
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const [loadingData, setLoadingData] = useState(true);

	const onFormSubmit = async (values: IFormState) => {
		setIsLoading(true);
		setSuccess('');
		setError('');

		saveBikeData(values)
			.then((result) => {
				setSuccess(result.message);
				if (!id) {
					history.push(`/admin/bike/edit/${result.data.id}`);
				}
			})
			.catch((err) => {
				setError(err.message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	useEffect(() => {
		if (id) {
			setLoadingData(true);
			getBikeById(id)
				.then((response) => {
					setBike(response);
					setLoadingData(false);
				})
				.catch((err) => {
					setError(err.message);
				});
		} else {
			setLoadingData(false);
		}
	}, [id]);

	return (
		<React.Fragment>
			<Grid container xs={12}>
				<Grid item xs={6}>
					<Formik
						enableReinitialize={true}
						initialValues={bike || INITIAL_FORM_STATE}
						validationSchema={FORM_VALIDATION}
						onSubmit={onFormSubmit}
					>
						{({ values }) => (
							<Card>
								<CardHeader title='Fill in bike detail'></CardHeader>
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
												<Grid item xs={12} md={6}>
													<BTextField
														fullWidth
														id='model'
														label='Model'
														name='model'
													/>
												</Grid>
												<Grid item xs={12} md={6}>
													<BTextField
														fullWidth
														id='weight'
														label='Weight'
														name='weight'
														type='number'
													/>
												</Grid>
												<Grid item xs={12} md={6}>
													<BSelect
														fullWidth
														id='color'
														label='Select Color'
														name='color'
														options={{ red: 'Red', green: 'Green' }}
													></BSelect>
												</Grid>
												<Grid item xs={12} md={12}>
													<div>
														<BLocationSelect name='location' />
													</div>
												</Grid>
												<Grid item xs={12} md={12}>
													<BFileUpload
														name='photo'
														previewUrl={values.photoUrl}
													/>
												</Grid>

												<Grid item xs={12} md={12}>
													<BCheckbox
														id='isAvailable'
														label='Is Available to rent'
														name='isAvailable'
													/>
												</Grid>
											</Grid>

											<div className={classes.buttons}>
												<BSubmitButton
													variant='contained'
													color='primary'
													className={classes.button}
													isloading={isLoading}
													loadingComponent={'Please wait...'}
												>
													Save
												</BSubmitButton>
											</div>
										</Form>
									)}
								</CardContent>
							</Card>
						)}
					</Formik>
				</Grid>
			</Grid>
		</React.Fragment>
	);
};
export default BikeEdit;
