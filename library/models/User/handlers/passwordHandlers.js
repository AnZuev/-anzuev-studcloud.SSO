'use strict';


let Q = require('q'),
	Util = require('util'),
	DbError = require("@anzuev/studcloud.errors").DbError,
	AuthError = require("@anzuev/studcloud.errors").AuthError,
	Crypto = require('crypto');



/*
	Проверка пароля.
	Вход:
		- пароль
	Выход:
		- true - пароль верен
		- false - пароль неверен
 */
function checkPassword (password){
	return (this.encryptPassword(password) === this.auth.hashed_password);
}

exports.checkPassword = checkPassword;




