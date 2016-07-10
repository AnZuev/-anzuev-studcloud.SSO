'use strict';
let Q = require('q'),
	UAMS = require('@anzuev/studcloud.uams'),
	ValidationError = require("@anzuev/studcloud.errors").ValidationError;

const logger = require('../libs/logger').getLogger();


/**
 * Миддлвер для авторизации пользователя.
 * Перед вызовом необходимо убедиться, что внутри this.authData находятся необходимые данные.
 * Необходимые проперти - mail и password
 * @param next - переход к следующему миддлверу
 * @memberof module:SSO~SSO
 * @function signIn
 * @throws {AuthError}, 401 - неверный парль
 * @example
 *  //router file
 *     router.get('/signIn', require('path/to/handler.js', SSO.signIn);
 *  // path/to/handler.js
 *     ...
 *     let a = b;
 *     yield next;
 *     // если все хорошо, продолжится выполнение
 *     // если пароль не верный, будет ошибка
 *     // и управление попадет обработчику ошибок
 *     ...
 */
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

/**
 * Миддлвер для авторизации пользователя
 * @param next - переход к следующему миддлверу
 * @memberof module:SSO~SSO
 * @function signIn
 * @throws {AuthError}, 401 - неверный парль

 * @example
 *  //router file
 *     router.get('/signIn', require('path/to/handler.js', SSO.signIn);
 *  // path/to/handler.js
 *     ...
 *     let a = b;
 *     yield next;
 *     // если все хорошо, продолжится выполнение
 *     // если пароль не верный, будет ошибка
 *     // и управление попадет обработчику ошибок
 *     ...
 */
exports.logout = function*(next){
	this.session.user = null;
	yield next;
};
