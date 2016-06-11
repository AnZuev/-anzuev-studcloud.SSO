'use strict';
let Util = require('util'),
	session = require('express-session'),
	Q = require('q');

let config = require('./config'),
	Users = require('./library/models/User').User,
	DbError = require("@anzuev/studcloud.errors").DbError;




/*
	SSO class for StudCloud project;

 */
function SSO(){

	var store;

	this.init = function(configuration){
		store = getStore(configuration.auth);
		// check configuration
		if(!store) throw new Error("Module 'studcloud.SSO' hasn't been configured");
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

SSO.prototype.getSessionsMiddleware = function(){

	// check configuration
	if(!store) throw new Error("Module 'studcloud.SSO' hasn't been configured");

	return session({
		secret: config.get('session:secret'),
		key: config.get('session:key'),
		cookie: config.get('session:cookie'),
		resave: false,
		saveUninitialized: true,
		store: store
	})
};

SSO.prototype.getContextMiddleware = function(){

	// check configuration
	if(!store) throw new Error("Module 'studcloud.SSO' hasn't been configured");

	return loadContext;
};





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
		- settings
			- db
			- host
			- port
			- user(optional)
			- password(optional)
 */
function getStore(settings){

	let MongoStore = require('connect-mongo/es5')(session);


	let url;
	if(settings.user && settings.password){
		url = Util.format("mongodb://%s:%s@%s:%d/%s",
			settings.user,
			settings.password,
			settings.host,
			settings.port,
			settings.db)

	}else{
		url = Util.format("mongodb://%s:%d/%s",
			settings.host,
			settings.port,
			settings.db);
	}
	return new MongoStore({url: url});
}



let sso = new SSO();
module.exports = sso;