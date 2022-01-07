import React, { useContext, useEffect, useState } from 'react';
import { auth } from './firebase';
import firebase from 'firebase';

type UserType = firebase.User | null;
type SignInUpFnType = (
	args: IUserLoginCred
) => Promise<firebase.auth.UserCredential>;

interface IUserLoginCred {
	email: string;
	password: string;
	rememberMe?: boolean;
}
interface IAuthContextProps {
	role?: string;
	currentUser?: UserType;
	signUp: SignInUpFnType;
	signIn: SignInUpFnType;
	signOut: () => Promise<void>;
}

const signUp = ({ email, password }: IUserLoginCred) => {
	return auth.createUserWithEmailAndPassword(email, password);
};
const signIn = ({ email, password, rememberMe }: IUserLoginCred) => {
	return auth
		.setPersistence(
			rememberMe
				? firebase.auth.Auth.Persistence.LOCAL
				: firebase.auth.Auth.Persistence.SESSION
		)
		.then(() => {
			return firebase.auth().signInWithEmailAndPassword(email, password);
		});
};
const signOut = () => {
	return auth.signOut();
};

const defaultValue: IAuthContextProps = {
	signUp,
	signIn,
	signOut,
};

const AuthContext = React.createContext<IAuthContextProps>(defaultValue);

export const AuthProvider = ({ children }: any) => {
	const [currentUser, setCurrentUser] = useState<UserType>(null);
	const [loading, setLoading] = useState(true);
	const [role, setRole] = useState('');
	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (!user) {
				setLoading(false);
			}
			user
				?.getIdTokenResult()
				.then((val) => {
					setRole(val.claims.admin ? 'manager' : 'user');
					setLoading(false);
				})
				.catch((err) => {
					setLoading(false);
				});
			setCurrentUser(user);
		});
		return unsubscribe;
	}, []);

	const currentValue = {
		currentUser,
		role,
		...defaultValue,
	};

	return (
		<AuthContext.Provider value={currentValue}>
			{!loading && children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
