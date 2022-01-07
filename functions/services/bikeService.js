const admin = require('firebase-admin');

exports.delteBike = async ({ bikeId }) => {
	return admin.firestore().collection('bikes').doc(bikeId).delete();
};

exports.getAllBikes = async () => {
	const snapShot = await admin.firestore().collection('bikes').get();
	return snapShot.docs.map((m) => {
		return { id: m.id, ...m.data() };
	});
};

exports.getBikeById = async ({ bikeId }) => {
	const snapShot = await admin
		.firestore()
		.collection('bikes')
		.doc(bikeId)
		.get();
	return { id: snapShot.id, ...snapShot.data() };
};
