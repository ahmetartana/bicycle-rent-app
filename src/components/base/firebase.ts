import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';

var firebaseConfig = {
	apiKey: process.env.API_KEY,
	authDomain: process.env.AUTH_DOMAIN,
	projectId: process.env.PROJECT_ID,
	storageBucket: process.env.STORAGE_BUCKET,
	messagingSenderId: process.env.MESSAGING_SENDER_ID,
	appId: process.env.APP_ID,
};
// Initialize Firebase

const app = firebase.initializeApp(firebaseConfig);
if (process.env.NODE_ENV === 'development') {
	app.functions().useEmulator('localhost', 5001);
}

export const auth = app.auth();
export const db = app.firestore();

export { app };
