import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { useAuth } from './AuthContext';

type PrivateRouteProps = RouteProps & {
	roles?: string[];
	Layout: any;
	title?: string;
};

export const AppRoute = ({
	component: Component,
	roles,
	Layout,
	title,
	...rest
}: PrivateRouteProps) => {
	const { currentUser, role } = useAuth();
	return (
		<Route
			{...rest}
			render={(props) => {
				if (roles && roles.length > 0 && !currentUser) {
					return (
						<Redirect
							to={{ pathname: '/auth/signin', state: { from: props.location } }}
						/>
					);
				}
				if (!role || !roles || roles.indexOf(role) === -1) {
					return <Redirect to={{ pathname: '/' }} />;
				}
				return (
					<Layout title={title}>
						{/* @ts-ignore */}
						{React.createElement(Component!, props)}
					</Layout>
				);
			}}
		/>
	);
};
