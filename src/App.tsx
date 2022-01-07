import { AppRoute, AuthProvider } from '@brent/base';
import { AdminLayout, UserLayout } from '@brent/ui';
import { StylesProvider } from '@material-ui/core/styles';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const BikeEdit = lazy(() => import('./pages/admin/bikeedit/BikeEdit'));
const UserEdit = lazy(() => import('./pages/admin/useredit/UserEdit'));

const UserList = lazy(() => import('./pages/admin/userlist/UserList'));
const UserReservations = lazy(
	() => import('./pages/admin/userlist/UserReservations')
);

const BikeList = lazy(() => import('./pages/admin/bikelist/BikeList'));
const BikeReservations = lazy(
	() => import('./pages/admin/bikelist/BikeReservations')
);

// these components are eager loaded to improve user experience rather than load time.
// first load javascript size is not that large
import { ChangePassword } from './pages/profile/ChangePassword';
import { ForgotPassword } from './pages/auth/forgotpassword';
import { ResetPassword } from './pages/auth/resetpassword';
import { SignIn } from './pages/auth/signin';
import { SignUp } from './pages/auth/signup';

import { Home, Reservation, ReservationList, HomeMap } from './pages/home';

export default function App() {
	return (
		<div>
			<StylesProvider>
				<BrowserRouter>
					<AuthProvider>
						<Suspense fallback={<div></div>}>
							<Switch>
								<Route exact path='/auth/signin' component={SignIn}></Route>
								<Route exact path='/auth/signup' component={SignUp}></Route>
								<Route
									exact
									path='/auth/forgotpassword'
									component={ForgotPassword}
								></Route>
								<Route
									exact
									path='/auth/resetpassword'
									component={ResetPassword}
								></Route>
								<AppRoute
									exact
									path='/profile/changepassword'
									roles={['manager', 'user']}
									Layout={UserLayout}
									component={ChangePassword}
								></AppRoute>
								<AppRoute
									exact
									path='/reservations'
									roles={['manager', 'user']}
									Layout={UserLayout}
									component={ReservationList}
								></AppRoute>

								<AppRoute
									exact
									path='/map'
									roles={['manager', 'user']}
									Layout={UserLayout}
									component={HomeMap}
								></AppRoute>

								<AppRoute
									exact
									path='/reserve/:bikeId'
									roles={['manager', 'user']}
									Layout={UserLayout}
									component={Reservation}
								></AppRoute>

								<AppRoute
									exact
									path='/'
									roles={['manager', 'user']}
									Layout={UserLayout}
									component={Home}
								></AppRoute>

								<AppRoute
									exact
									path='/admin'
									roles={['manager']}
									title='Bike List'
									Layout={AdminLayout}
									component={BikeList}
								></AppRoute>
								<AppRoute
									exact
									path='/admin/user/edit/'
									roles={['manager']}
									title='Create New User'
									Layout={AdminLayout}
									component={UserEdit}
								></AppRoute>
								<AppRoute
									exact
									path='/admin/user/edit/:uid'
									roles={['manager']}
									title='Update User'
									Layout={AdminLayout}
									component={UserEdit}
								></AppRoute>
								<AppRoute
									exact
									path='/admin/user/list'
									roles={['manager']}
									title='User List'
									Layout={AdminLayout}
									component={UserList}
								></AppRoute>
								<AppRoute
									exact
									path='/admin/user/reservations/:uid'
									roles={['manager']}
									title='Users Reservations'
									Layout={AdminLayout}
									component={UserReservations}
								></AppRoute>
								<AppRoute
									exact
									path='/admin/bike/list'
									roles={['manager']}
									title='Bike List'
									Layout={AdminLayout}
									component={BikeList}
								></AppRoute>
								<AppRoute
									exact
									path='/admin/bike/reservations/:bikeId'
									roles={['manager']}
									title='Bikes Reservation'
									Layout={AdminLayout}
									component={BikeReservations}
								></AppRoute>
								<AppRoute
									exact
									path='/admin/bike/edit/:id'
									roles={['manager']}
									Layout={AdminLayout}
									title='Update Bike'
									component={BikeEdit}
								></AppRoute>
								<AppRoute
									exact
									path='/admin/bike/edit'
									roles={['manager']}
									Layout={AdminLayout}
									title='Create Bike'
									component={BikeEdit}
								></AppRoute>
							</Switch>
						</Suspense>
					</AuthProvider>
				</BrowserRouter>
			</StylesProvider>
		</div>
	);
}
