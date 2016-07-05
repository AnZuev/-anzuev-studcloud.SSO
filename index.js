'use strict';
let session = require('koa-generic-session'),
	MongoStore = require('koa-generic-session-mongo'),
	Q = require('q');

let Users = require('./library/models/User'),
	DbError = require("@anzuev/studcloud.errors").DbError;

const UAMS = require('@anzuev/studcloud.uams');





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


SSO.prototype.signIn = require('./library/handlers/auth').signIn;
SSO.prototype.logout = require("./library/handlers/auth").logout;


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


SSO.prototype.isPasswordChangeAllowed = function*(session){
	if(!session.actions){
		return false;
	}
	return (session.actions.passwordChange);
};
SSO.prototype.confirmPasswordChange = function*(next){
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
SSO.prototype.dropPasswordChangeAccess = function*(next){
	this.session.actions.passwordChange = false;
};

/*
 get authLevel:
 0 - unauthorized,
 1 - authorized
 2 - mail confirmed
 3 - mobile confirmed
 4 - document confirmed
 get user:
 user - authLevel > 0
 undefined - authLevel = 0

 */
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