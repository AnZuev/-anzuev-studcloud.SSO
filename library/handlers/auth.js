'use strict';
let Q = require('q'),
	User = require('../models/User'),
	ValidationError = require("@anzuev/studcloud.errors").ValidationError;


exports.signUp = function(authData){
	validateInputData(authData);
	return User.signUp(authData);
};

function validateInputData(authData){

	if(authData.mail.length < 5) throw new ValidationError(400, 'Mail is incorrect');
	if(authData.password.length < 5) throw new ValidationError(400, 'Password is too weak');
	if(!(authData.name && authData.surname)) throw new ValidationError(400, 'Incorrect personal info');

}

exports.signIn = function(authData){
	return User.signIn(authData);
};


exports.logout = function(req, res, next){
	req.session.user = null;
	next();
};
