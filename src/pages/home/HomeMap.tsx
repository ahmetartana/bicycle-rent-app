import { IBike } from '@brent/types';
import { Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useHistory } from 'react-router-dom';
import { BikeCardSpecView } from './components/BikeCardView';

const useStyles = makeStyles((theme: any) => ({
	formControl: {
		width: '100%',
	},
	secondaryText: {
		textAlign: 'right',
	},
	listItem: {
		fontSize: 12,
		marginRight: 6,
	},
	map: {
		height: '80vh',
	},
	gridTextButton: {
		marginTop: '20px',
	},
	message: {
		marginBottom: theme.spacing(2),
	},
	leafletPopup: {
		margin: 0,
	},
}));

function averageGeolocation(bikelist: IBike[]) {
	if (bikelist.length === 1) {
		return {
			lat: bikelist[0].location.latitude,
			lng: bikelist[0].location.longitude,
		};
	}

	let x = 0.0;
	let y = 0.0;
	let z = 0.0;

	for (let coord of bikelist) {
		let latitude = (coord.location.latitude * Math.PI) / 180;
		let longitude = (coord.location.longitude * Math.PI) / 180;

		x += Math.cos(latitude) * Math.cos(longitude);
		y += Math.cos(latitude) * Math.sin(longitude);
		z += Math.sin(latitude);
	}

	let total = bikelist.length;

	x = x / total;
	y = y / total;
	z = z / total;

	let centralLongitude = Math.atan2(y, x);
	let centralSquareRoot = Math.sqrt(x * x + y * y);
	let centralLatitude = Math.atan2(z, centralSquareRoot);

	return {
		lat: (centralLatitude * 180) / Math.PI,
		lng: (centralLongitude * 180) / Math.PI,
	};
}

export const HomeMap = ({ bikeList }: { bikeList: IBike[] }) => {
	const classes = useStyles();
	const history = useHistory();
	// React memoization should be used to avoid recalculation
	const loc = averageGeolocation(bikeList);
	const [centerValue] = React.useState(loc);
	return (
		<React.Fragment>
			<Card>
				<CardContent>
					<MapContainer center={centerValue} zoom={10} className={classes.map}>
						<TileLayer
							attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
							url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
						/>
						{bikeList.map((bike) => {
							return (
								<Marker
									position={[bike.location.latitude, bike.location.longitude]}
								>
									<Popup
										minWidth={250}
										maxHeight={328}
										className={classes.leafletPopup}
									>
										<Card>
											<CardMedia
												component='img'
												height='140'
												image={bike.photo}
											/>
											<CardContent>
												<List>
													<BikeCardSpecView
														color='green'
														primary='Model'
														secondary={bike.model}
													/>
													<BikeCardSpecView
														color='red'
														primary='Color'
														secondary={bike.color}
													/>
													<BikeCardSpecView
														color='blue'
														primary='Weight'
														secondary={`${bike.weight} kg`}
													/>
													<BikeCardSpecView
														color='orange'
														primary='Score'
														secondary={bike.score?.toString() || 'Not Rated'}
													/>
												</List>
												<Button
													size='small'
													fullWidth
													color='primary'
													variant='outlined'
													onClick={() => {
														history.push(`/reserve/${bike.id}`);
													}}
												>
													Reserve
												</Button>
											</CardContent>
										</Card>
									</Popup>
								</Marker>
							);
						})}
					</MapContainer>
				</CardContent>
			</Card>
		</React.Fragment>
	);
};
