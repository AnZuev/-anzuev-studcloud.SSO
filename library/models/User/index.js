'use strict';

let Q = require('q'),
	Util = require('util'),
	DbError = require("@anzuev/studcloud.errors").DbError,
	AuthError = require("@anzuev/studcloud.errors").AuthError,
	Crypto = require('crypto'),
	User = require("@anzuev/studcloud.datamodels").User,
	connection = require('../../../connections').users;


User.methods.encryptPassword = function(password){
	return Crypto.createHmac('sha1',this.auth.salt).update(password + "").digest("hex");
};

User.virtual('auth.password')
	.set(function(password) {
		this.auth._plainPassword = password;
		this.auth.salt = Math.random() + "";
		this.auth.hashed_password = this.encryptPassword(password);
	})
	.get(function() { return this._plainPassword;} );


User.methods.checkPassword = require('./handlers/passwordHandlers').checkPassword;

User.statics.setPasswordKey = require('./handlers/passwordHandlers').setPasswordKey;

User.statics.hasPasswordTokenByMail = require('./handlers/passwordHandlers').hasPasswordTokenByMail;

User.methods.getChangePasswordContext = require('./handlers/passwordHandlers').getChangePasswordContext;

User.statics.setNewPasswordByMail = require('./handlers/passwordHandlers').setNewPasswordByMail;

User.methods.setPasswordKey = function(){
	this.changePassword.key = Crypto.createHmac('sha1', Math.random() + "")
		.update(this.auth.mail)
		.digest("hex").toString();
};


User.methods.getAuthLevel = function(){
	if(this.authActions.documentSubmit.done){
		return 4;
	}else if(this.authActions.mobileSubmit.done){
		return 3;
	}else if(this.authActions.mailSubmit.done){
		return 2;
	}else{
		return 1;
	}
};

User.statics.getById = function(id){
	let defer = Q.defer();
	let promise = this.findById(id);
	promise.then(function(user){
		if(!user) return defer.reject(new DbError(null, 404, Util.format("No user found by %s", id)));
		else{
			return defer.fulfill(user);
		}
	}).catch(function(err){
		defer.reject(new DbError(err, 500));
	});
	return defer.promise;
};

User.methods.saveUser = function(){
	let a = 5;
	let user;
	let User = this;
	return Q.async(function*(){
		while(a > 0){
			try{
				user = yield User.save();
				return user;
			}catch(err){
				a--;
			}
		}
		throw new DbError(null, "Can't save user");
	})();
};


User.statics.signIn = function(authData){
	let User = this;
	return Q.async(function*(){
		let user;
		try{
			user =  yield User.findOne({"auth.mail": authData.mail});
		}catch(err){
			throw new DbError(err, 500);
		}

		if(user){
			if(user.checkPassword(authData.password)) {
				return user;
			}else{
				throw new AuthError('Incorrect password', 401);
			}
		}else{
			throw new AuthError('Incorrect mail', 401);
		}
	})();
};

User.statics.signUp = function(authData){
	let User = this;

	return Q.async(function*(){
		let user;
		try{
			user = yield User.findOne({"auth.mail": authData.mail});
		}catch(err){
			throw new DbError(err, 500);
		}

		if(user){
			throw new AuthError(400, Util.format("mail %s already in use", authData.mail));
		}
		let key = Crypto.createHmac('sha1', Math.random() + "").update(authData.mail).digest("hex").toString();
		let newUser = new User({
			pubInform:{
				name: authData.name,
				surname: authData.surname
			},
			auth:{
				mail: authData.mail,
				password: authData.password
			},
			authActions:{
				mailSubmit:{
					key: key
				}
			}
		});
		return yield newUser.saveUser();
	})();
};



User.statics.confirmMail = function(mail, key){
	let defer = Q.defer();


	let promise = this.update(
		{
			"auth.mail": mail,
			"authActions.mailSubmit.key": key
		},
		{
			"authActions.mailSubmit.done": true,
			"authActions.mailSubmit.key": null
		}
	);
	promise.then(function(result){
		if(result.nModified == 1) defer.resolve(true);
		else{
			defer.reject(new AuthError(403, 'Confirmation failed'));
		}
	}).catch(function(err){
		defer.reject(new DbError(err, 500));
	});

	return defer.promise;
};

User.statics.confirmMobile = function(mail, phone, key){
	let defer = Q.defer();


	let promise = this.update(
		{
			"auth.mail": mail,
			"authActions.mobileSubmit.key": key
		},
		{
			"authActions.mobileSubmit.done": true,
			"authActions.mobileSubmit.key": ''
		}
	);
	promise.then(function(result){
		if(result.nModified == 1) defer.resolve(true);
		else{
			defer.reject(new AuthError(403, 'Confirmation failed'));
		}
	}).catch(function(err){
		defer.reject(new DbError(err, 500));
	});

	return defer.promise;
};


module.exports = connection.model("User", User);



