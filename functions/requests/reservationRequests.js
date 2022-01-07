const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {
	getReservationByBikeId,
	getReservationById,
	deleteReservation,
	getReservationsByUserId,
} = require('../services/reservationService');
const { getBikeById } = require('../services/bikeService');
const { getUserById } = require('../services/userService');
const { isUserAdmin, authorize } = require('../security/userSecurity');

exports.getMyReservations = functions.https.onCall(async (data, context) => {
	const userId = context.auth.uid;
	const query = await admin
		.firestore()
		.collection('reservation')
		.where('userId', '==', userId)
		.get();

	const bikePromises = new Array();
	const map = [];
	const bikemap = {};
	query.forEach((doc) => {
		const { bikeId, startDate, endDate } = doc.data();
		map.push({
			id: doc.id,
			bikeId: bikeId,
			startDate: startDate.toMillis(),
			endDate: endDate.toMillis(),
		});
		const bikePromise = admin.firestore().collection('bikes').doc(bikeId).get();
		bikePromises.push(bikePromise);
	});

	const snapShots = await Promise.all(bikePromises);

	snapShots.map((doc) => {
		const bike = doc.data();
		if (bike) {
			const { photo, model, color, weight } = bike;
			bikemap[doc.id] = {
				photo,
				model,
				color,
				weight,
			};
		}
	});

	const result = map.map((res) => {
		return { ...res, ...bikemap[res.bikeId] };
	});

	return result;
});

exports.makeReservation = functions.https.onCall(async (data, context) => {
	const { startDate, endDate, bikeId } = data;
	const bikeRef = await admin.firestore().collection('bikes').doc(bikeId).get();
	const bike = bikeRef.data();
	if (bike.isAvailable) {
		const query = await admin
			.firestore()
			.collection('reservation')
			.where('bikeId', '==', bikeId)
			.get();

		const bikeList = new Array();
		query.forEach((doc) => {
			bikeList.push(doc.data());
		});

		const isInValidDates = bikeList.some((val) => {
			const sts = val.startDate.toMillis();
			const ets = val.endDate.toMillis();
			return (
				(startDate <= ets && startDate >= sts) ||
				(endDate <= ets && endDate >= sts) ||
				(startDate <= sts && endDate >= ets)
			);
		});

		if (isInValidDates) {
			return {
				success: false,
				message: 'Bike is not available during these dates',
			};
		}

		const response = await admin
			.firestore()
			.collection('reservation')
			.add({
				bikeId,
				startDate: new Date(startDate),
				endDate: new Date(endDate),
				userId: context.auth.uid,
				status: 1,
			});

		return { success: true, response };
	}
	throw new Error('erorr occured');
});

exports.getReservationsByBikeId = functions.https.onCall(
	async (data, context) => {
		await authorize({ context });
		const { bikeId } = data;
		const reservationList = await getReservationByBikeId({ bikeId });
		let userMap = {};
		reservationList.map((res) => {
			if (!userMap[res.userId]) {
				const userPromise = admin
					.firestore()
					.collection('userprofile')
					.doc(res.userId)
					.get();
				userMap[res.userId] = userPromise;
			}
		});

		const snapShots = await Promise.all(Object.values(userMap));
		snapShots.forEach((doc) => {
			userMap[doc.id] = doc.data();
		});
		const bike = await getBikeById({ bikeId });
		const result = reservationList.map((res) => {
			const { firstName, lastName, email } = userMap[res.userId];
			const { startDate, endDate, userId, id } = res;
			return {
				id,
				firstName,
				lastName,
				email,
				startDate: startDate.toMillis(),
				endDate: endDate.toMillis(),
				userId,
			};
		});
		return { bike, result };
	}
);

exports.getReservationsByUserId = functions.https.onCall(
	async (data, context) => {
		await authorize({ context });
		const { userId } = data;
		const reservationList = await getReservationsByUserId({ userId });
		let bikeMap = {};
		reservationList.map((res) => {
			if (!bikeMap[res.userId]) {
				const bikePromise = admin
					.firestore()
					.collection('bikes')
					.doc(res.bikeId)
					.get();
				bikeMap[res.bikeId] = bikePromise;
			}
		});

		const snapShots = await Promise.all(Object.values(bikeMap));
		snapShots.forEach((doc) => {
			bikeMap[doc.id] = doc.data();
		});
		const user = await getUserById({ userId });
		const result = reservationList.map((res) => {
			const { model, color, weight, photo } = bikeMap[res.bikeId];
			const { startDate, endDate, bikeId, id } = res;
			return {
				id,
				bikeId,
				model,
				color,
				weight,
				photo,
				startDate: startDate.toMillis(),
				endDate: endDate.toMillis(),
			};
		});
		return { user, result };
	}
);

exports.cancelReservation = functions.https.onCall(async (data, context) => {
	const { reservationId } = data;
	const userId = context.auth.uid;
	const reservation = await getReservationById({ reservationId });
	if (reservation.userId === userId || isUserAdmin({ context })) {
		await deleteReservation({ reservationId });
		return { success: true, message: 'Reservation has been cancelled' };
	}
	throw new functions.https.HttpsError(
		'unauthenticated',
		'You are not authorized for this operation'
	);
});
