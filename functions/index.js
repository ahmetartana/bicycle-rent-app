const admin = require('firebase-admin');
admin.initializeApp();

const reservationRequests = require('./requests/reservationRequests');
const userRequests = require('./requests/userRequests');
const bikeRequests = require('./requests/bikeRequests');

// reservation requests
exports.makeReservation = reservationRequests.makeReservation;
exports.getMyReservations = reservationRequests.getMyReservations;
exports.getReservationsByBikeId = reservationRequests.getReservationsByBikeId;
exports.getReservationsByUserId = reservationRequests.getReservationsByUserId;
exports.cancelReservation = reservationRequests.cancelReservation;

// user requests
exports.listAllUsers = userRequests.listAllUsers;
exports.createOrUpdateUser = userRequests.createOrUpdateUser;
exports.getUserById = userRequests.getUserById;
exports.deleteUser = userRequests.deleteUser;

// bikes requests
exports.filterBikes = bikeRequests.filterBikes;
exports.scoreBike = bikeRequests.scoreBike;
exports.getBikeScoreInfo = bikeRequests.getBikeScoreInfo;
exports.deleteBike = bikeRequests.deleteBike;
exports.listBikeAdmin = bikeRequests.listBikeAdmin;
