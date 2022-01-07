const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {
	getAllReservations,
	getReservationByBikeId,
} = require('../services/reservationService');
const { delteBike, getAllBikes } = require('../services/bikeService');

exports.filterBikes = functions.https.onCall(async (data, context) => {
	const { color, weight, model, date, score } = data;
	let reservedBikes = [];
	if (date && (date.startDate || date.endDate)) {
		const allReservations = await getAllReservations({ ...date });
		reservedBikes = [...new Set(allReservations.map((m) => m.bikeId))];
	}
	let query = await admin.firestore().collection('bikes').get();
	let bikes = query.docs.map((m) => {
		const data = m.data();
		const { latitude, longitude } = data.location;
		return {
			id: m.id,
			location: { latitude, longitude },
			color: data.color,
			weight: data.weight,
			model: data.model,
			photo: data.photo,
			score: data.score,
			totalScore: data.totalScore,
		};
	});
	if (reservedBikes.length) {
		bikes = bikes.filter((m) => reservedBikes.indexOf(m.id) < 0);
	}
	if (color && color.length) {
		bikes = bikes.filter((m) => color.indexOf(m.color) > -1);
	}
	if (weight) {
		if (weight.min) {
			bikes = bikes.filter((m) => m.weight >= weight.min);
		}
		if (weight.max) {
			bikes = bikes.filter((m) => m.weight <= weight.max);
		}
	}
	if (model) {
		bikes = bikes.filter((m) => m.model.includes(model));
	}
	if (score) {
		if (score.min) {
			bikes = bikes.filter((m) => m.score >= score.min);
		}
		if (score.max) {
			bikes = bikes.filter((m) => m.score <= score.max);
		}
	}
	return bikes;
});

exports.getBikeScoreInfo = functions.https.onCall(async (data, context) => {
	const { reservationId } = data;
	console.log(data);
	const scoreCollection = admin.firestore().collection('bikescores');
	const reservationCollection = admin.firestore().collection('reservation');
	const bikeCollection = admin.firestore().collection('bikes');

	const reservationSnap = await reservationCollection.doc(reservationId).get();
	const reservationData = reservationSnap.data();

	const bikeScoresSnap = await scoreCollection
		.where('reservationId', '==', reservationId)
		.get();
	const bikeScoreData = bikeScoresSnap.docs?.map((m) => {
		return { id: m.id, ...m.data() };
	});

	const bikeSnap = await bikeCollection.doc(reservationData.bikeId).get();
	const bikeData = bikeSnap.data();

	return {
		score: bikeScoreData[0]?.score,
		bike: bikeData,
		canScore: reservationData.endDate.toDate() <= new Date(),
	};
});

exports.scoreBike = functions.https.onCall(async (data, context) => {
	const { reservationId, score } = data;
	const userId = context.auth.uid;
	const scoreCollection = admin.firestore().collection('bikescores');
	const reservationCollection = admin.firestore().collection('reservation');

	const reservationSnap = await reservationCollection.doc(reservationId).get();
	const reservationData = reservationSnap.data();

	if (reservationData.userId !== userId) {
		return { error: true, message: 'You cannot rate this reservation' };
	}

	if (reservationData.endDate.toDate() > new Date(Date.now())) {
		return { error: true, message: 'reservation is not finished yet' };
	}
	// get existing bike score data
	const bikeScoresSnap = await scoreCollection
		.where('reservationId', '==', reservationId)
		.get();
	const bikeScoreData = bikeScoresSnap.docs?.map((m) => {
		return { id: m.id, ...m.data() };
	});

	const bikeRef = admin
		.firestore()
		.collection('bikes')
		.doc(reservationData.bikeId);
	if (bikeScoreData && bikeScoreData.length) {
		await scoreCollection.doc(bikeScoreData[0].id).update({
			score,
		});
		await admin.firestore().runTransaction(async (transaction) => {
			const bikeDoc = await transaction.get(bikeRef);
			const { score: oldScore, totalScore: oldTotalScore } = bikeDoc.data();
			const oldRatingTotal = oldScore * oldTotalScore;
			const newAvgScore =
				(oldRatingTotal + score - bikeScoreData[0].score) / oldTotalScore;
			transaction.update(bikeRef, {
				score: parseFloat(newAvgScore.toFixed(2)),
			});
		});
	} else {
		await scoreCollection.add({
			userId,
			reservationId,
			score,
		});
		await admin.firestore().runTransaction(async (transaction) => {
			const bikeDoc = await transaction.get(bikeRef);
			const { score: oldScore, totalScore: oldTotalScore } = bikeDoc.data();
			const oldRatingTotal = oldScore * oldTotalScore;
			const newAvgScore = (oldRatingTotal + score) / (oldTotalScore + 1);

			transaction.update(bikeRef, {
				score: parseFloat(newAvgScore.toFixed(2)),
				totalScore: oldTotalScore + 1,
			});
		});
	}
	return { success: true, message: 'Your score has been saved successfully' };
});

exports.deleteBike = functions.https.onCall(async (data, context) => {
	const { id } = data;
	await this.deleteBike(id);
});

exports.listBikeAdmin = functions.https.onCall(async (data, context) => {
	const { filter } = data;
	let bikes = await getAllBikes();
	if (!filter || filter === 'all') {
		return bikes;
	}

	const reservations = await getAllReservations({});
	const reservedBikeIds = new Set(reservations.map((m) => m.bikeId));
	console.log(reservedBikeIds);
	switch (filter) {
		case 'onlyReserved': {
			bikes = bikes.filter((m) => reservedBikeIds.has(m.id));
			break;
		}
		case 'notReserved': {
			bikes = bikes.filter((m) => !reservedBikeIds.has(m.id));
			break;
		}
		default: {
			return bikes;
		}
	}
	return bikes;
});
