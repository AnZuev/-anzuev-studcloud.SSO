'use strict';
let session = require('koa-generic-session'),
	MongoStore = require('koa-generic-session-mongo'),
	Q = require('q');

let Users = require('./library/models/User'),
	DbError = require("@anzuev/studcloud.errors").DbError;





/*
 SSO class for StudCloud project;

 */
function SSO(){

	var store;
	var self = this;
	
	this.setStore = function(newStore){
		store = newStore;
	};

	this.getStore = function(){
		return store;
	};

	this.init = function(){
		self.setStore(getStore());
		// check configuration
		if(!self.getStore()) throw new Error("Module 'studcloud.SSO' hasn't been configured");
	};

}



SSO.prototype.checkAuthMiddleware = require('./library/handlers/access').checkAuth;
SSO.prototype.checkMailActivationMiddleware = require('./library/handlers/access').checkMailActivation;
SSO.prototype.checkMobileActivationMiddleware = require('./library/handlers/access').checkMobileActivation;
SSO.prototype.checkDocumentActivationMiddleware = require('./library/handlers/access').checkDocumentActivation;


SSO.prototype.signUp = require('./library/handlers/auth').signUp;
SSO.prototype.signIn = require('./library/handlers/auth').signIn;
SSO.prototype.logout = require("./library/handlers/auth").logout;

SSO.prototype.confirmMail = require('./library/handlers/confirmation').mail;
SSO.prototype.confirmMobile = require('./library/handlers/confirmation').mobile;
SSO.prototype.confirmDocument = require('./library/handlers/confirmation').document;

SSO.prototype.setPassword = require('./library/handlers/passwords').setPassword;
SSO.prototype.setPasswordKey = require('./library/handlers/passwords').setPasswordKey;

SSO.prototype.getSessionsMiddleware = function(settings){

	// check configuration
	if(!this.getStore()) throw new Error("Module 'studcloud.SSO' hasn't been configured");
	if(!settings) settings = require("./config").get('sso:session');
	return session({
		secret: settings.secret,
		key: settings.key,
		prefix: 'StudCloud:sessions:',
		cookie: settings.cookie,
		resave: false,
		saveUninitialized: true,
		store: this.getStore()
	})
};

SSO.prototype.getContextMiddleware = function(){
	if(!this.getStore()) throw new Error("Module 'studcloud.SSO' hasn't been configured");
	return loadContext;
};


SSO.prototype.checkPermissionToGetFile = require('./library/handlers/pssAccess').checkPermissionToViewFile;





/*
 get authLevel:
 0 - unauthorized,
 1 - authorized
 2 - mail confirmed
 3 - mobile confirmed
 4 - document confirmed
 get changePasswordToken:
 string - allow to change password
 undefined - not allow to change password
 get user:
 user - authLevel > 0
 undefined - authLevel = 0

 */
function* loadContext(next){
	let context = {};
	let session = this.session;

	if(!session.user){
		context.authLevel = 0;
		yield next;
	}

	let user = yield Users.getById(session.user);
	context.changePasswordKey = user.getChangePasswordContext();
	context.authLevel = user.getAuthLevel();

	this.user = user;
	this.context = context;

	yield next;
};


/*
 function to get MongoStore for sessions
 Вход:
 -void
 */
function getStore(){
	let mongooseConnection = require('./connections').sso;
	return new MongoStore({
		host: mongooseConnection.host,
		port: mongooseConnection.port,
		user: mongooseConnection.user,
		password: mongooseConnection.password,
		db: mongooseConnection.name
});
}



let sso = new SSO();
module.exports = sso;