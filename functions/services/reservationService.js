const admin = require('firebase-admin');

exports.getAllReservations = async ({ startDate, endDate }) => {
	const reservationSnapShot = await admin
		.firestore()
		.collection('reservation')
		.get();

	let data = reservationSnapShot.docs.map((m) => m.data());
	if (startDate) {
		data = data.filter((m) => m.startDate.toDate() >= new Date(startDate));
	}
	if (endDate) {
		data = data.filter((m) => m.endDate.toDate() <= new Date(endDate));
	}
	return data;
};

exports.getReservationByBikeId = async ({ bikeId }) => {
	const reservationSnapShot = await admin
		.firestore()
		.collection('reservation')
		.where('bikeId', '==', bikeId)
		.get();

	const result = reservationSnapShot.docs.map((m) => {
		const data = m.data();
		return {
			id: m.id,
			startDate: data.startDate,
			endDate: data.endDate,
			userId: data.userId,
		};
	});
	return result;
};
exports.getReservationById = async ({ reservationId }) => {
	const reservationSnapShot = await admin
		.firestore()
		.collection('reservation')
		.doc(reservationId)
		.get();
	return reservationSnapShot.data();
};

exports.deleteReservation = async ({ reservationId }) => {
	return admin
		.firestore()
		.collection('reservation')
		.doc(reservationId)
		.delete();
};

exports.getReservationsByUserId = async ({ userId }) => {
	const reservationSnapShot = await admin
		.firestore()
		.collection('reservation')
		.where('userId', '==', userId)
		.get();

	const result = reservationSnapShot.docs.map((m) => {
		const data = m.data();
		return {
			id: m.id,
			startDate: data.startDate,
			endDate: data.endDate,
			userId: data.userId,
			bikeId: data.bikeId,
		};
	});
	return result;
};
