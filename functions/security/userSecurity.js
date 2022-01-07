const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.authorize = async ({ context }) => {
	const currentUserId = context.auth.uid;
	const callerUserRecord = await admin.auth().getUser(currentUserId);
	if (!callerUserRecord.customClaims.admin) {
		throw new functions.https.HttpsError(
			'unauthenticated',
			'You are not authorized for this operation'
		);
	}
};

exports.isUserAdmin = async ({ context }) => {
	const currentUserId = context.auth.uid;
	const callerUserRecord = await admin.auth().getUser(currentUserId);
	return callerUserRecord.customClaims.admin;
};
