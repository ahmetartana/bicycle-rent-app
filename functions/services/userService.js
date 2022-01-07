const admin = require('firebase-admin');

exports.getUserById = async ({ userId }) => {
	const snapShot = await admin
		.firestore()
		.collection('userprofile')
		.doc(userId)
		.get();
	return { id: snapShot.id, ...snapShot.data() };
};

exports.deleteUserById = async ({ userId }) => {
	// firebase does not support cross transaction between auth and firestore.
	admin.auth().deleteUser(userId);

	var batch = admin.firestore().batch();
	const userSnapShot = await admin
		.firestore()
		.collection('userprofile')
		.doc(userId)
		.get();

	batch.delete(userSnapShot.ref);

	const reservationSnapShot = await admin
		.firestore()
		.collection('reservation')
		.where('userId', '==', userId)
		.get();

	reservationSnapShot.forEach((doc) => {
		batch.delete(doc.ref);
	});

	return await batch.commit();
};
