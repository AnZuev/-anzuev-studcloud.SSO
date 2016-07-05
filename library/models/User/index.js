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

User.methods.isInGroup = function(group){
	return (this.pubInform.group == group);
};

User.statics.signIn = function*(authData){
	let User = this;
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

};


User.methods.isInGroup = function(group){
	return (this.pubInform.group == group);
};

module.exports = connection.model("User", User);



