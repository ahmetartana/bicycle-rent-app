import { Avatar, CssBaseline, Grid, Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh',
	},
	image: {
		backgroundImage: 'url(/login-background.jpg)',
		backgroundRepeat: 'no-repeat',
		backgroundColor:
			theme.palette.type === 'light'
				? theme.palette.grey[50]
				: theme.palette.grey[900],
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	},
	paper: {
		marginTop: theme.spacing(20),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
}));

interface AuthLayoutProps {
	title: string;
	Icon: any;
}

export const AuthLayout: React.FC<AuthLayoutProps> = (props) => {
	const classes = useStyles();

	return (
		<Grid container component='main' className={classes.root}>
			<CssBaseline />
			<Grid item xs={false} sm={4} md={7} className={classes.image} />
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<Container component='main' maxWidth='xs' className={classes.paper}>
					<Avatar className={classes.avatar}>
						{React.createElement(props.Icon, {})}
					</Avatar>
					<Typography component='h1' variant='h5'>
						{props.title}
					</Typography>
					{props.children}
				</Container>
			</Grid>
		</Grid>
	);
};
