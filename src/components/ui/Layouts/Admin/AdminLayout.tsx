import { BAppBar } from './AppBar';
import { DrawerMenu } from './DrawerMenu';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import DirectionsBike from '@material-ui/icons/DirectionsBike';
import { Link } from 'react-router-dom';

import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	appBarSpacer: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		height: '100vh',
		overflow: 'auto',
	},
	container: {
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(1),
	},
}));

interface IAdminLayoutProps {
	title?: string;
}

const MenuItems = () => {
	return (
		<div>
			<ListItem component={Link} to='/admin' button>
				<ListItemIcon>
					<DashboardIcon />
				</ListItemIcon>
				<ListItemText primary='Dashboard' />
			</ListItem>
			<ListItem component={Link} to='/admin/user/list' button>
				<ListItemIcon>
					<PeopleIcon />
				</ListItemIcon>
				<ListItemText primary='User List' />
			</ListItem>

			<ListItem component={Link} to='/admin/bike/list' button>
				<ListItemIcon>
					<DirectionsBike />
				</ListItemIcon>
				<ListItemText primary='Bike List' />
			</ListItem>
			<Divider />

			<ListItem component={Link} to='/' button>
				<ListItemIcon>
					<HomeIcon />
				</ListItemIcon>
				<ListItemText primary='Home' />
			</ListItem>
		</div>
	);
};

export const AdminLayout: React.FC<IAdminLayoutProps> = (props) => {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const handleDrawerOpen = () => {
		setOpen(true);
	};
	const handleDrawerClose = () => {
		setOpen(false);
	};
	return (
		<div className={classes.root}>
			<CssBaseline />
			<BAppBar
				title={props.title}
				isDrawerOpen={open}
				handleDrawerOpen={handleDrawerOpen}
			/>
			<DrawerMenu isDrawerOpen={open} handleDrawerClose={handleDrawerClose}>
				<MenuItems />
			</DrawerMenu>
			<main className={classes.content}>
				<div className={classes.appBarSpacer} />
				<Container maxWidth={false} className={classes.container}>
					<>{props.children}</>
				</Container>
			</main>
		</div>
	);
};
