import { app } from '@brent/base';
import { IBike } from '@brent/types';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import { red } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { useParams } from 'react-router-dom';
import { BikeCardSpecView } from './components/BikeCardView';
import { ReservationForm } from './components/ReservationForm';

const useStyles = makeStyles((theme: any) => ({
	map: {
		height: '30vh',
	},
	message: {
		marginBottom: theme.spacing(2),
	},
	avatar: {
		backgroundColor: red[500],
	},
}));

interface IBikeParams {
	bikeId: string;
}

export const Reservation = () => {
	const { bikeId } = useParams<IBikeParams>();
	const classes = useStyles();
	const [bikeInfo, setBikeInfo] = useState<IBike>();

	useEffect(() => {
		app
			.firestore()
			.collection('bikes')
			.doc(bikeId)
			.get()
			.then((result) => {
				const bike = result.data();
				console.log(bike);
				if (bike) {
					setBikeInfo(bike as IBike);
				}
			});
	}, []);
	return (
		<React.Fragment>
			<Grid container spacing={3}>
				{bikeInfo && (
					<React.Fragment>
						<Grid item xs={12} md={8}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Card>
										<CardMedia
											component='img'
											height={400}
											image={bikeInfo.photo}
										/>
									</Card>
								</Grid>
								<Grid item xs={12}>
									<Card>
										<CardContent>
											<MapContainer
												center={[
													bikeInfo.location.latitude,
													bikeInfo.location.longitude,
												]}
												zoom={20}
												className={classes.map}
											>
												<TileLayer
													attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
													url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
												/>
												<Marker
													position={[
														bikeInfo.location.latitude,
														bikeInfo.location.longitude,
													]}
												></Marker>
											</MapContainer>
										</CardContent>
									</Card>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12} md={4}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Card>
										<CardHeader
											avatar={
												<Avatar aria-label='recipe'>
													<SettingsIcon />
												</Avatar>
											}
											title='Specifications'
											subheader='see this bicycle specifications below'
										/>
										<CardContent>
											<BikeCardSpecView
												color='green'
												primary='Model'
												secondary={bikeInfo.model}
											></BikeCardSpecView>
											<BikeCardSpecView
												color='red'
												primary='Color'
												secondary={bikeInfo.color}
											></BikeCardSpecView>
											<BikeCardSpecView
												color='blue'
												primary='Weight'
												secondary={bikeInfo.weight}
											></BikeCardSpecView>
											<BikeCardSpecView
												color='orange'
												primary='Score'
												secondary={bikeInfo.score?.toString() || 'Not Rated'}
											></BikeCardSpecView>
										</CardContent>
									</Card>
								</Grid>
								<Grid item xs={12}>
									<Card>
										<CardHeader
											avatar={
												<Avatar aria-label='recipe'>
													<ShoppingBasketIcon />
												</Avatar>
											}
											title='Booking Information'
											subheader='fill in the below details to book this bike'
										/>
										<CardContent>
											<ReservationForm bikeId={bikeId}></ReservationForm>
										</CardContent>
									</Card>
								</Grid>
							</Grid>
						</Grid>
					</React.Fragment>
				)}
			</Grid>
		</React.Fragment>
	);
};
