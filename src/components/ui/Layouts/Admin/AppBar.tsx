import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import { useAuth } from '@brent/base';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	toolbar: {
		paddingRight: 24, // keep right padding when drawer closed
	},
	toolbarIcon: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar,
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: 36,
	},
	menuButtonHidden: {
		display: 'none',
	},
	title: {
		flexGrow: 1,
	},
}));

interface BAppBarProps {
	isDrawerOpen: boolean;
	handleDrawerOpen: () => void;
	title?: string;
}

export const BAppBar = (props: BAppBarProps) => {
	const classes = useStyles();
	const { currentUser, signOut } = useAuth();
	return (
		<AppBar
			position='absolute'
			className={clsx(
				classes.appBar,
				props.isDrawerOpen && classes.appBarShift
			)}
		>
			<Toolbar className={classes.toolbar}>
				<IconButton
					edge='start'
					color='inherit'
					aria-label='open drawer'
					onClick={props.handleDrawerOpen}
					className={clsx(
						classes.menuButton,
						props.isDrawerOpen && classes.menuButtonHidden
					)}
				>
					<MenuIcon />
				</IconButton>
				<Typography
					component='h1'
					variant='h6'
					color='inherit'
					noWrap
					className={classes.title}
				>
					{props.title || 'Dashboard'}
				</Typography>
				<Button color='inherit' disableRipple={true}>
					{currentUser?.email}
				</Button>
				<Button color='inherit' variant='outlined' onClick={() => signOut()}>
					Logout
				</Button>
			</Toolbar>
		</AppBar>
	);
};
