'use strict';
let session = require('express-session'),
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

SSO.prototype.confirmMail = require('./library/handlers/confirmation').mail;
SSO.prototype.confirmMobile = require('./library/handlers/confirmation').mobile;
SSO.prototype.confirmDocument = require('./library/handlers/confirmation').document;

SSO.prototype.setPassword = require('./library/handlers/passwords').setPassword;
SSO.prototype.setPasswordKey = require('./library/handlers/passwords').setPasswordKey;

SSO.prototype.getSessionsMiddleware = function(settings){

	// check configuration
	if(!this.getStore()) throw new Error("Module 'studcloud.SSO' hasn't been configured");

	return session({
		secret: settings.secret,
		key: settings.key,
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
function loadContext(req, res, next){
	req.context = {};

	if(!req.session.user){
		req.context.authLevel = 0;
		return next();
	}
	Q.async(function*(){
		try{
			req.user = yield Users.getById(req.session.user);
			req.context.changePasswordKey = req.user.getChangePasswordContext();
			req.context.authLevel = req.user.getAuthLevel();
			return next();
		}catch(err){
			if(err instanceof DbError){
				return next(err);
			}else{
				return next(new DbError(err, 500));
			}
		}
	})().done();
};


/*
 function to get MongoStore for sessions
 Вход:
 -void
 */
function getStore(){
	let MongoStore = require('connect-mongo/es5')(session);
	return new MongoStore({mongooseConnection: require('./connections').sso});
}



let sso = new SSO();
module.exports = sso;