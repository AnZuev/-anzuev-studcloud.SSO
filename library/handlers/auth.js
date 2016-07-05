'use strict';
let Q = require('q'),
	UAMS = require('@anzuev/studcloud.uams'),
	ValidationError = require("@anzuev/studcloud.errors").ValidationError;

const logger = require('../libs/logger');




exports.signIn = function*(next){
	let user = yield* UAMS.getUserByMail(this.authData.mail);
	if(!user.checkPassword(this.authData.password)){
		let err = new AuthError(401, "Incorrect password");
		logger.info(err);
		throw err;
	}
	let context = {};


	context.authLevel = user.getAuthLevel();
	this.user = user;
	this.context = context;
	this.session.user = user._id;
	yield next;
};


exports.logout = function*(next){
	this.session.user = null;
	yield next;
};
