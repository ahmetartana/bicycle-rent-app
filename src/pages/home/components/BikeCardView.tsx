import { IBike } from '@brent/types';
import { Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	listItem: {
		fontSize: 12,
		marginRight: 6,
	},
	listItemPrimary: {
		height: 25,
	},
	secondaryText: {
		textAlign: 'right',
	},
}));

interface BikeCardSpecViewProps {
	color: string;
	primary: string;
	secondary: string;
}

export const BikeCardSpecView = (props: BikeCardSpecViewProps) => {
	const classes = useStyles();

	return (
		<ListItem disableGutters className={classes.listItemPrimary}>
			<FiberManualRecordIcon
				className={classes.listItem}
				style={{
					color: props.color,
				}}
			/>
			<ListItemText primary={props.primary} />
			<ListItemText
				className={classes.secondaryText}
				secondary={props.secondary}
			/>
		</ListItem>
	);
};
interface IBikeCardViewPrps {
	bike: IBike;
}

export const BikeCardView = ({ bike }: IBikeCardViewPrps) => {
	const history = useHistory();
	const score = bike.totalScore! > 0 ? bike.score!.toString() : 'Not Rated';
	return (
		<Card>
			<CardMedia component='img' height='140' image={bike.photo} />
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
					<BikeCardSpecView color='orange' primary='Score' secondary={score} />
				</List>
			</CardContent>
			<CardActions>
				<Button
					size='small'
					fullWidth
					color='primary'
					variant='outlined'
					onClick={() => history.push(`/reserve/${bike.id}`)}
				>
					Reserve
				</Button>
			</CardActions>
		</Card>
	);
};
