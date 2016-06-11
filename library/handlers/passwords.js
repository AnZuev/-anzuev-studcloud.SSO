'use strict';


let Util = require('util'),
	Log = require('../libs/log')(module),
	DbError = require("@anzuev/studcloud.errors").DbError,
	ValidationError = require("@anzuev/studcloud.errors").ValidationError,
	User = require('../models/User/index').User;

function setPasswordKey(mail){
	if(mail.length == 0) throw new ValidationError(400, Util.format("Is is forbidden to use an empty mail"));
	return User.setPasswordKey(mail);
}
exports.setPasswordKey = setPasswordKey;


function setPassword(mail, key, newPassword){
	if(key.length == 0) throw new ValidationError(400, Util.format("Is is forbidden to use an empty key"));
	return User.setNewPasswordByMail(mail, key, newPassword);
}
exports.setPassword = setPassword;



