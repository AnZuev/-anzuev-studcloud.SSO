'use strict';


let Q = require('q'),
	Util = require('util'),
	DbError = require("@anzuev/studcloud.errors").DbError,
	AuthError = require("@anzuev/studcloud.errors").AuthError,
	Crypto = require('crypto');


/*
	Установить ключ для смены пароля.
	Вход:
		- почта
	Выход:
		- promise:
			- {mail: mail, key: key} - все хорошо
			- DbError(code = 404) - пользователь не найден по почте
            - DbError(code = 500) - ошибка базы данных
 */
function setPasswordKey (mail){
	let defer = Q.defer();
	let key = Crypto.createHmac('sha1', Math.random() + "").update(mail).digest("hex").toString();

	let promise = this.update(
		{
			"auth.mail": mail
		},
		{
			"authActions.changePassword.key": key
		});

	promise.then(function(result){
		if(result.nModified == 0){
			defer.reject(new DbError(null, 403, Util.format("No user found by mail '%s'", mail)));
		}else{
			defer.fulfill({mail: mail, key: key});
		}
	}).catch(function(err){
		defer.reject(new DbError(err, 500));
	});

	return defer.promise;

}

exports.setPasswordKey = setPasswordKey;


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


/*
	 Получения статуса идет ли сейчас смена пароля или нет(установлен ли ключ для смены)
	 Вход:
	    void
	 Выход:
	 - key - ключ для смены.
	 - false - не установлен
 */
function getChangePasswordContext(){
	if(this.authActions.changePassword.key.length > 6){
		return this.authActions.changePassword.key;
	}else{
		return false;
	}
}

exports.getChangePasswordContext = getChangePasswordContext;




/*
	 Установить новый пароль по ключу
	 Вход:
	    - почта,
	    - ключ,
	    - новый пароль
	 Выход:
	    - promise:
	        - true - все хорошо
	        - DbError(code = 404) - пользователь не найден по почте
			- DbError(code = 500) - ошибка базы данных
 */
function setNewPasswordByMail (mail, key, password){

	let defer = Q.defer();

	let promise = this.update(
		{
			"auth.mail": mail,
			"authActions.changePassword.key": key
		},
		{
			"authActions.changePassword.key": "",
			"auth.password": password
		});

	promise.then(function(result){
		if(result.n == 0){
			defer.reject(new AuthError(null, 403, Util.format("Forbidden to set password by mail '%s' and key='%s'", mail, key)));
		}else if(result.nModified == 1){
			defer.fulfill(true);
		}else{
			defer.reject("This is impossible case. Tell @AnZuev if it occures");
		}
	}).catch(function(err){
		defer.reject(new DbError(err, 500));
	});
	return defer.promise;
}

exports.setNewPasswordByMail = setNewPasswordByMail;




/*
	 Проверить есть ли ключ для смены пароля по почте.
	 Вход:
	    - почта
	    - ключ
	 Выход:
		 - promise:
			 - true есть
			 - false - нет
			 - DbError(code = 500) - ошибка базы данных
 */

function hasPasswordTokenByMail(mail, key){
	let defer = Q.defer();

	let promise = this.findOne(
		{
			"auth.mail": mail,
			"authActions.changePassword.key": key
		});

	promise.then(function(user){
		if(!user) {
			defer.fulfill(false)
		}else{
			defer.fulfill(true)
		}
	}).catch(function(err){
		defer.reject(new DbError(err, 500));
	});

}

exports.hasPasswordTokenByMail = hasPasswordTokenByMail;

