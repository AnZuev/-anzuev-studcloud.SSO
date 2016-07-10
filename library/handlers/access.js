'use strict';

let AuthError = require("@anzuev/studcloud.errors").AuthError;

/**
 * Миддлвер для проверки авторизован ли пользователь или нет
 * @param next - переход к следующему миддлверу
 * @memberof module:SSO~SSO
 * @function checkAuth
 * @throws {AuthError}, 405 - уровень авторизации недостаточен
 * @this SSO
 * @example
 *  //router file
 *     router.get('/doSomething', require('path/to/handler.js', SSO.checkAuth);
 *  // path/to/handler.js
 *     ...
 *     let a = b;
 *     yield next;
 *     // если все хорошо, продолжится выполнение
 *     // если пользователь не авторизован, будет ошибка
 *     // и управление попадет обработчику ошибок
 *     ...
 */
exports.checkAuth = function*(next){
	if(this.context.authLevel < 1){
		throw new AuthError(401, "Действие требует авторизации");
	}else{
		yield next;
	}
};


/**
 * Миддлвер для проверки уровня авторизации(подтвердена либо почта, либо документ либо телефон)
 * @param next - переход к следующему миддлверу
 * @memberof module:SSO~SSO
 * @function checkMailActivation
 * @throws {AuthError}, 405 - уровень авторизации недостаточен

 * @example
 *  //router file
 *     router.get('/doSomething', require('path/to/handler.js', SSO.checkMailActivation);
 *  // path/to/handler.js
 *     ...
 *     let a = b;
 *     yield next;
 *     // если уровень авторизации > 1, то продолжится выполнение
 *     // иначе ошибка
 *     // и управление попадет обработчику ошибок
 *     ...
 */
exports.checkMailActivation = function*(next){
	if(this.context.authLevel < 2) {
		throw new AuthError(405, "Действие требует подтверждения почтового адреса");
	}else{
		yield next;
	}
};


/**
 * Миддлвер для проверки уровня авторизации(подтверден либо документ, либо телефон)
 * @param next - переход к следующему миддлверу
 * @memberof module:SSO~SSO
 * @function checkMobileActivation
 * @throws {AuthError}, 405 - уровень авторизации недостаточен
 * @example
 *  //router file
 *     router.get('/doSomething', require('path/to/handler.js', SSO.checkMobileActivation);
 *  // path/to/handler.js
 *     ...
 *     let a = b;
 *     yield next;
 *     // если уровень авторизации > 2, то продолжится выполнение
 *     // иначе ошибка
 *     // и управление попадет обработчику ошибок
 *     ...
 */
exports.checkMobileActivation = function*(next){
	if(this.context.authLevel < 3) {
		throw new AuthError(405, "Действие требует подтверждения номера телефона");
	}else{
		yield next;
	}
};


/**
 * Миддлвер для проверки уровня авторизации(подтверден документ)
 * @param next - переход к следующему миддлверу
 * @memberof module:SSO~SSO
 * @function checkDocumentActivation
 * @throws {AuthError}, 405 - уровень авторизации недостаточен
 * @example
 *  //router file
 *     router.get('/doSomething', require('path/to/handler.js', SSO.checkMobileActivation);
 *  // path/to/handler.js
 *     ...
 *     let a = b;
 *     yield next;
 *      // если уровень авторизации > 3, то продолжится выполнение
 *     // иначе ошибка
 *     // и управление попадет обработчику ошибок
 *     ...
 */
exports.checkDocumentActivation = function*(next){
	if(this.context.authLevel < 4) {
		throw new AuthError(405, "Действие требует подтверждения зачетной книжки");
	}else{
		yield next;
	}
};
