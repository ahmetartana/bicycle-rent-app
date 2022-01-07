import { useAuth } from '@brent/base';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import React from 'react';
import { Link as RouteLink, useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	appBar: {
		borderBottom: `1px solid ${theme.palette.divider}`,
	},
	toolbar: {
		flexWrap: 'wrap',
		paddingLeft: 0,
		paddingRight: 0,
	},
	toolbarTitle: {
		flexGrow: 1,
	},
	link: {
		margin: theme.spacing(0.5, 2),
	},
	container: {
		marginTop: theme.spacing(3),
	},
}));
interface IUserLayoutProps {}
export const UserLayout: React.FC<IUserLayoutProps> = (props) => {
	const classes = useStyles();
	const { currentUser, signOut, role } = useAuth();
	const history = useHistory();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleMenu = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<React.Fragment>
			<CssBaseline />
			<AppBar
				position='static'
				color='default'
				elevation={0}
				className={classes.appBar}
			>
				<Container maxWidth='lg' component='main'>
					<Toolbar className={classes.toolbar}>
						<div className={classes.toolbarTitle}>
							<Link
								color='textPrimary'
								component={RouteLink}
								variant='h6'
								to='/'
							>
								Home
							</Link>
						</div>
						<nav>
							<Link
								color='textPrimary'
								className={classes.link}
								component={RouteLink}
								to='/reservations'
							>
								Reservations
							</Link>
							{role && role === 'manager' && (
								<Link
									color='textPrimary'
									className={classes.link}
									component={RouteLink}
									to='/admin'
								>
									Admin Panel
								</Link>
							)}
						</nav>
						<Button
							aria-label='account of current user'
							aria-controls='menu-appbar'
							aria-haspopup='true'
							onClick={handleMenu}
							color='inherit'
							size='small'
							variant='outlined'
							startIcon={<AccountCircle />}
						>
							{currentUser?.displayName?.split(' ')[0]} ...
						</Button>
						<Menu
							id='menu-appbar'
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={open}
							onClose={handleClose}
						>
							<MenuItem
								onClick={() => {
									if (currentUser) {
										signOut()
											.then(() => {
												history.push('/auth/signin');
											})
											.catch((err) => {});
									}
									handleClose();
								}}
							>
								Logout
							</MenuItem>

							<MenuItem
								onClick={() => {
									handleClose();
								}}
								component={RouteLink}
								to='/profile/changepassword'
							>
								Change Password
							</MenuItem>
						</Menu>
					</Toolbar>
				</Container>
			</AppBar>
			<Container maxWidth='lg' component='main' className={classes.container}>
				<>{props.children}</>
			</Container>
		</React.Fragment>
	);
};
