'use strict';
let User = require('../models/User'),
	ValidationError = require("@anzuev/studcloud.errors").ValidationError,
	Util = require('util');



exports.mail = function(mail, key){
	if(key.length == 0) throw new ValidationError(400, Util.format("Is is forbidden to use an empty key"));
	return User.confirmMail(mail, key);
};

exports.mobile = function(mail, phone, key){
	if(key.length == 0) throw new ValidationError(400, Util.format("Is is forbidden to use an empty key"));
	return User.confirmMobile(mail, phone, key);
};

/*
exports.confirmDocument = function(mail, phone, key){
	return User.confirmMobile(mail, phone, key);
};
*/




exports.requestMobileConfirmation = function(mail, phone){

};