import { app } from '@brent/base';
import { IBike } from '@brent/types';
import { Button, CircularProgress } from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Rating from '@material-ui/lab/Rating';
import React, { useEffect, useState } from 'react';
import { BikeCardSpecView } from './BikeCardView';
import { BSubmitButton } from '@brent/form-ui';

interface IBikeScore {
	reservationId: string;
}
interface IBikeScoreData {
	score?: number;
	bike: IBike;
	canScore: boolean;
}

const useStyles = makeStyles((theme) => ({
	spaceTop: {
		marginTop: theme.spacing(2),
	},
}));
const RESERVATION_NOT_FINISHED =
	'This reservation is not finished yet. You may score the bike after reservation is finished';

export const BikeScore = ({ reservationId }: IBikeScore) => {
	console.log(reservationId);
	const classes = useStyles();
	const [bike, setBike] = useState<IBike>();
	const [score, setScore] = useState(0);
	const [canScore, setCanScore] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isSubmitting, setSubmitting] = useState(false);
	const [isDataLoading, setDataLoading] = useState(true);

	useEffect(() => {
		const callable = app.functions().httpsCallable('getBikeScoreInfo');
		callable({ reservationId })
			.then(({ data }: { data: IBikeScoreData }) => {
				setBike(data.bike);
				setScore(data.score || 0);
				setCanScore(data.canScore);
				if (!data.canScore) {
					setError(RESERVATION_NOT_FINISHED);
				}
			})
			.finally(() => {
				setDataLoading(false);
			});
	}, []);

	return (
		<React.Fragment>
			<Grid container>
				<Grid item xs={12}>
					{isDataLoading && <CircularProgress />}
					{bike && (
						<>
							<CardMedia component='img' height='240' image={bike.photo} />
							<CardContent>
								<List dense={true} disablePadding>
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
										secondary={
											bike.totalScore! > 0
												? bike.score!.toString()
												: 'Not Rated'
										}
									/>
								</List>
							</CardContent>
							{canScore && (
								<CardActions>
									<Grid container spacing={6}>
										<Grid item xs={12} md={6}>
											<Rating
												size='large'
												name='hover-feedback'
												value={score}
												precision={0.5}
												onChange={(event: any, newValue: any) => {
													setScore(newValue);
												}}
											/>
										</Grid>
										<Grid item xs={12} md={6}>
											<Button
												size='small'
												variant='outlined'
												color='primary'
												disabled={isSubmitting}
												onClick={async () => {
													setSubmitting(true);
													const callable = app
														.functions()
														.httpsCallable('scoreBike');
													callable({ reservationId, score })
														.then(({ data }) => {
															setSuccess('Your Score has been saved');
														})
														.catch((err) => {
															setError(err.message);
														})
														.finally(() => {
															setSubmitting(false);
														});
												}}
											>
												Save your score
											</Button>
										</Grid>
									</Grid>
								</CardActions>
							)}
						</>
					)}
					{error && (
						<Grid item xs={12} className={classes.spaceTop}>
							<Alert severity='error'>{error}</Alert>
						</Grid>
					)}
					{success && (
						<Grid item xs={12} className={classes.spaceTop}>
							<Alert severity='success'>{success}</Alert>
						</Grid>
					)}
				</Grid>
			</Grid>
		</React.Fragment>
	);
};
