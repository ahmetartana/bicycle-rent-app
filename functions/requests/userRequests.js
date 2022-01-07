const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { deleteUserById } = require('../services/userService');
const { authorize } = require('../security/userSecurity');

exports.listAllUsers = functions.https.onCall(async (data, context) => {
	await authorize({ context });
	const { filter } = data;
	const querySnapShot = await admin.firestore().collection('userprofile').get();
	let users = querySnapShot.docs.map((user) => {
		const data = user.data();
		return {
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			id: user.id,
			isAdmin: data.isAdmin,
		};
	});
	const resMap = [];
	if (filter === 'onlyReserved' || filter === 'notReserved') {
		users.forEach((user) => {
			const resPromise = admin
				.firestore()
				.collection('reservation')
				.where('userId', '==', user.id)
				.limit(1)
				.get();

			resMap.push(resPromise);
		});
		const resMapResponseSnapShot = await Promise.all(resMap);
		const reservedUserIds = new Set();
		resMapResponseSnapShot.forEach((val) => {
			val.docs.forEach((res) => {
				if (res.data()) {
					reservedUserIds.add(res.data().userId);
				}
			});
		});

		if (filter === 'onlyReserved') {
			users = users.filter((m) => reservedUserIds.has(m.id));
		}
		if (filter === 'notReserved') {
			users = users.filter((m) => !reservedUserIds.has(m.id));
		}
	}

	return users;
});

exports.createOrUpdateUser = functions.https.onCall(async (data, context) => {
	await authorize({ context });
	const { uid, firstName, lastName, email, password, isAdmin } = data;
	const userData = {
		email,
		emailVerified: false,
		disabled: false,
		displayName: `${firstName} ${lastName}`,
	};
	let userRecord = null;
	if (uid) {
		if (password) {
			userData.password = password;
		}
		userRecord = await admin.auth().updateUser(uid, userData);
	} else {
		userData.password = password;
		userRecord = await admin.auth().createUser(userData);
	}
	await admin
		.firestore()
		.collection('userprofile')
		.doc(userRecord.uid)
		.set({ firstName, lastName, isAdmin, email });
	await admin.auth().setCustomUserClaims(userRecord.uid, { admin: isAdmin });
	return userRecord.uid;
});

exports.getUserById = functions.https.onCall(async (data, context) => {
	await authorize({ context });
	const { uid } = data;
	if (uid) {
		const user = await admin.auth().getUser(uid);
		const querySnapShot = await admin
			.firestore()
			.collection('userprofile')
			.doc(user.uid)
			.get();

		const userProfile = querySnapShot.data();

		const responseData = {
			uid: user.uid,
			email: user.email,
			firstName: userProfile.firstName,
			lastName: userProfile.lastName,
			isAdmin: user.customClaims && user.customClaims['admin'],
		};
		return responseData;
	}
	return null;
});

exports.deleteUser = functions.https.onCall(async (data, context) => {
	await authorize({ context });
	const { userId } = data;
	if (userId === context.auth.uid) {
		return { success: false, message: 'You cannot delete yourself' };
	}
	deleteUserById({ userId }).then(() => {
		return { success: true, message: 'User has been deleted successfully' };
	});
	// if user is admin and user is not self
});
