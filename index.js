'use strict';
/**
 * @module SSO
 */
let session = require('koa-generic-session'),
	MongoStore = require('koa-generic-session-mongo'),
	Q = require('q'),
	DbError = require("@anzuev/studcloud.errors").DbError;

const UAMS = require('@anzuev/studcloud.uams');


/**
 * @class SSO
 */
function SSO(){ }

/**
 * Конфигурация для настройки модуля
 * @type {mongoose.model}
 * @private
 * @memberof module:SSO~SSO
 */
SSO._config = null;


/**
 * Установка хранилища для сессий
 * @private
 * @param newStore - хранилище
 * @memberof module:SSO~SSO

 */
SSO.setStore = function(newStore){
	SSO._store = newStore;
};

/**
 * Взятие хранилища
 * @memberof module:SSO~SSO
 * @private
 * @returns {sessionStore}
 */
SSO.getStore = function(){
	return SSO._store;
};

/**
 * Настройка модуля(обязательно перед использованием)
 * Настраивает логгер и соединение к бд
 * Пример конфига:
 * <pre><code>
 {
   "mongoose":{
	 "UsersUri": "mongodb://127.0.0.1/test_IStudentAPI",
	 "PSSUri": "mongodb://127.0.0.1/test_PSS",
	 "SSOUri": "mongodb://127.0.0.1/test_sso"
   },
   "sso":{
	 "session":{
	   "secret": "superSecretKey",
	   "key": "StudCloud:session:",
	   "cookie":{
		 "path": "/",
		 "maxAge":2592000000,
		 "httpOnly": true
	   }
	 }
   },
   "logs":{
	 "UAMS":{
	   "path": "/Users/anton/GitHub/SSO/logs/UAMS.log",
	   "label": "UAMS"
	 },
	 "SSO":{
	   "path": "/Users/anton/GitHub/SSO/logs/SSO.log",
	   "label": "SSO"
	 }
   }

 }
 </code></pre>
 * @param config - конфигурация типа nconf
 */
SSO.configure = function(config){
	SSO._config = config;
	require('./connections').configure(config);
	require('./library/libs/logger').configure(config);
	SSO.setStore(getStore());
	if(!SSO.getStore()) throw new Error("Module 'studcloud.SSO' hasn't been configured");

	SSO.checkAuthMiddleware = require('./library/handlers/access').checkAuth;
	SSO.checkMailActivationMiddleware = require('./library/handlers/access').checkMailActivation;
	SSO.checkMobileActivationMiddleware = require('./library/handlers/access').checkMobileActivation;
	SSO.checkDocumentActivationMiddleware = require('./library/handlers/access').checkDocumentActivation;


	SSO.signIn = require('./library/handlers/auth').signIn;
	SSO.logout = require("./library/handlers/auth").logout;


	/**
	 * Получение миддлвера сессий
	 * @example
	 * app.use(SSO.getSessionsMiddleware();
	 * @returns {*}
	 * @throws {Error}, модуль не был настроен
	 */
	SSO.getSessionsMiddleware = function(){

		// check configuration
		if(!SSO.getStore()) throw new Error("Module 'studcloud.SSO' hasn't been configured");
		let settings = SSO._config.get('sso:session');
		return session({
			secret: settings.secret,
			key: settings.key,
			prefix: 'StudCloud:sessions:',
			cookie: settings.cookie,
			resave: false,
			saveUninitialized: true,
			store: SSO.getStore()
		})
	};


	/**
	 * Получение миддлвера для загрузки контекста
	 * @example
	 * app.use(SSO.getContextMiddleware());
	 * @returns {loadContext}
	 * @throws {Error}, модуль не был настроен

	 */
	SSO.getContextMiddleware = function(){
		if(!SSO.getStore()) throw new Error("Module 'studcloud.SSO' hasn't been configured");
		return loadContext;
	};


	SSO.checkPermissionToGetFile = require('./library/handlers/pssAccess').checkPermissionToViewFile;


	/**
	 * Проверка можно ли пользователю менять пароль
	 * @param session - объект типа koa-session
	 * @returns {boolean}, true - можно, false - нельзя
	 *
	 */
	SSO.isPasswordChangeAllowed = function*(session){
		if(!session.actions){
			return false;
		}
		return (session.actions.passwordChange);
	};

	/**
	 * Миддлвер для валидации ключа для смены, если ключ верный, то метод isPasswordChangeAllowed будет возвращать true
	 * В this.state.passwordKey должен быть помещен ключ
	 * @returns {boolean}, true - ключ верный, false - ключ не верный
	 */
	SSO.confirmPasswordChange = function*(){
		if(this.user.confirmPasswordToken(this.state.passwordKey)){
			if(this.session.actions){
				this.session.actions.passwordChange = true;
			}else{
				this.session.actions = {};
				this.session.actions.passwordChange = true;
			}
			return true;
		}
		return false;
	};

	/**
	 * Миддлвер для сброса возможности менять пароль для данной сессии. Вызывается после смены пароля.
	 * @param next
	 */
	SSO.dropPasswordChangeAccess = function*(next){
		this.session.actions.passwordChange = false;
	};

};





function* loadContext(next){
	let context = {};
	let session = this.session;
	if(!session.user){
		context.authLevel = 0;
	}else{
		let user = yield UAMS.getUserById(session.user);
		context.authLevel = user.getAuthLevel();
		this.user = user;
	}
	this.context = context;
	yield next;
};


/*
 function to get MongoStore for sessions
 Вход:
 -void
 */
function getStore(){
	let mongooseConnection = require('./connections').getConnections().sso;
	return new MongoStore({
		host: mongooseConnection.host,
		port: mongooseConnection.port,
		user: mongooseConnection.user,
		password: mongooseConnection.password,
		db: mongooseConnection.name
});
}



module.exports = SSO;