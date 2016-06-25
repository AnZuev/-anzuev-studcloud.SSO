'use strict';
let Q = require('q'),
	User = require('../models/User'),
	ValidationError = require("@anzuev/studcloud.errors").ValidationError;


exports.signUp = function*(next){
	validateInputData(this.authData);

	let context = {};
	let user = yield* User.signUp(this.authData);

	context.changePasswordKey = user.getChangePasswordContext();
	context.authLevel = user.getAuthLevel();
	this.user = user;
	this.context = context;
	this.session.user = user._id;
	yield next;
};

function validateInputData(authData){

	if(authData.mail.length < 5) throw new ValidationError(400, 'Mail is incorrect');
	if(authData.password.length < 5) throw new ValidationError(400, 'Password is too weak');
	if(!(authData.name && authData.surname)) throw new ValidationError(400, 'Incorrect personal info');

}

exports.signIn = function*(next){
	let user = yield* User.signIn(this.authData);
	let context = {};

	context.changePasswordKey = user.getChangePasswordContext();
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
