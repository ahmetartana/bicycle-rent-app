import { IBike } from '@brent/types';
import { Button, CircularProgress, LinearProgress } from '@material-ui/core';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import React, { useEffect, useState } from 'react';
import { BikeList } from './components/BikeList';
import { FilterForm } from './components/FilterForm';
import { HomeMap } from './HomeMap';
import { app } from '@brent/base';
import { useCallback } from 'react';

const useStyles = makeStyles((theme) => ({
	filterList: {},
	icon: {
		display: 'flex',
		justifyContent: 'flex-end',
		marginBottom: 10,
	},
}));

export function Home() {
	const classes = useStyles();
	const [showImage, setShowImage] = useState<boolean>(true);
	const [bikeList, setBikeList] = useState<IBike[]>([]);
	const [filter, setFilter] = useState({});
	const [isDataLoading, setDataLoading] = useState(false);

	const getBikes = (query: any) => {
		setDataLoading(true);
		const callable = app.functions().httpsCallable('filterBikes');
		callable(query)
			.then(({ data }) => {
				setBikeList(data);
			})
			.finally(() => {
				setDataLoading(false);
			});
	};

	useEffect(() => {
		getBikes(filter);
	}, [filter]);

	return (
		<Grid container>
			<Grid item xs={12} className={classes.icon}>
				<ButtonGroup size='small' aria-label='small outlined button group'>
					<Button
						disabled={!showImage}
						onClick={() => {
							setShowImage(false);
						}}
					>
						<LocationOnOutlinedIcon />
					</Button>
					<Button
						disabled={showImage}
						onClick={() => {
							setShowImage(true);
						}}
					>
						<ImageOutlinedIcon />
					</Button>
				</ButtonGroup>
			</Grid>

			<Grid container spacing={3}>
				<Grid item md={3} xs={12}>
					<Grid item xs={12} className={classes.filterList}>
						<FilterForm onFilterChange={setFilter}></FilterForm>
					</Grid>
				</Grid>
				<Grid item md={9} xs={12}>
					{isDataLoading && <LinearProgress color='primary' />}
					{showImage && <BikeList bikeList={bikeList}></BikeList>}
					{!showImage && <HomeMap bikeList={bikeList}></HomeMap>}
				</Grid>
			</Grid>
		</Grid>
	);
}
