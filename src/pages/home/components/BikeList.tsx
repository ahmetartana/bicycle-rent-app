import { IBike } from '@brent/types';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { BikeCardView } from './BikeCardView';

const useStyles = makeStyles((theme) => ({
	infiniteScroll: {
		overflow: 'hidden !important',
	},
	infiniteScrollLoader: {
		width: 100,
		height: 100,
		margin: 'auto',
		padding: 50,
	},
	bikelist: {},
}));

export const BikeList = ({ bikeList }: { bikeList: IBike[] }) => {
	const classes = useStyles();

	return (
		<Grid container spacing={3} className={classes.bikelist}>
			{bikeList.map((row: IBike) => (
				<Grid key={row.id} item xs={12} md={4}>
					<BikeCardView bike={row}></BikeCardView>
				</Grid>
			))}
		</Grid>
	);
};
