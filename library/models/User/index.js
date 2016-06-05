'use strict';

var mongoose = require('../../libs/mongoose'),
    Schema = mongoose.Schema,
	Q = require('q'),
	Util = require('util'),
	Log = require('../../libs/log')(module),
	DbError = require("@anzuev/studcloud.errors").DbError,
	Crypto = require('crypto');


let async = require('async');

var User = new Schema({
    auth: {
        mail:{
            require: true,
            type: String,
            unique: true
        },
        hashed_password:{
            type:String,
            require: true
        },
        salt:{
            type:String,
            require: true
        }
    },

    pubInform:{
        name:{
            type:String,
            require: true
        },
        surname:{
            type:String,
            require: true
        },
        photo:{
            type: String,
            require: false,
            default: ''
        },
        university:{
            type: Schema.Types.ObjectId,
            require: true
        },
        faculty:{
	        type: Schema.Types.ObjectId,
            require:true
        },
        group:{
            type: String,
            require: false
        },
        year:{
            type: Number,
            require:true
        }
    },

    prInform:{
        mail:{
            type: String
        },
        phone:{
            type: String
        }
    },

    privacy:{
        blockedUsers:[Schema.Types.ObjectId]
    },

    contacts:[{
	    id: Schema.Types.ObjectId,
	    updated: {
		    type:Date,
		    default:Date.now()
	    },
	    _id:0
    }],

    projects:[{}],

	settings:{
		im:[
			{
				convId: Schema.Types.ObjectId,
				notification: Boolean,
				tag:{
					title:String,
					color: String
				},
				_id:0
			}
		]
	},

	authActions:{
		mailSubmit: {
			done: {
				type: Boolean,
				default: false
			},
			key: {
				type: String,
				default: false
			}
		},
		mobileSubmit: {
			done: {
				type: Boolean,
				default: false
			},
			key: {
				type: String,
				default: false
			}
		},
		documentSubmit: {
			done: {
				type: Boolean,
				default: false
			},
			key: {
				type: String,
				default: false
			}
		},
		changePassword:{
			key: {
				type: String,
				default: false
			}
		}
	},

	created:{
		type: Date,
		default: Date.now()
	}

}, {
	collection: 'users'
});



User.statics.setPasswordKey = function(mail){
	let defer = Q.defer();
	let key = Crypto.createHmac('sha1', Math.random() + "").update(mail).digest("hex").toString();

	let promise = this.update(
		{
			"auth.mail": mail
		},
		{
			"activation.passwordKey": key
		});

	promise.then(function(result){
		if(result.nModified == 0){
			defer.reject(new DbError(null, 404, Util.format("No user find by mail '%'", mail)));
		}else{
			defer.fulfill({mail: mail, key: key});
		}
	}).catch(function(err){
		defer.reject(new DbError(err, 500));
	});

	return defer.promise;

};

User.statics.hasPasswordTokenByMail = function(mail, key){
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

};

User.methods.getChangePasswordContext = function(){
	if(this.authActions.changePassword.key.length > 6){
		return this.authActions.changePassword.key;
	}else{
		return false;
	}
};

User.statics.setNewPasswordByMail = function(mail, key, password){

	let defer = Q.defer();
	let rubbish = Crypto.createHmac('sha1', Math.random() + "").update(mail).update(key).digest("hex").toString();

	let promise = this.update(
		{
			"auth.mail": mail,
			"activation.passwordKey": key
		},
		{
			"activation.passwordKey": rubbish,
			"auth.password": password
		});

	promise.then(function(result){
		if(result.n == 0){
			defer.reject(new DbError(null, 404, Util.format("No user find by mail '%'", mail)));
		}else if(result.nModified == 1){
			defer.fulfill(true);
		}else{
			defer.reject("This is impossible case. Tell @AnZuev if it occures");
		}
	}).catch(function(err){
		defer.reject(new DbError(err, 500));
	})

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
	var a = 5;
	return Q.async(function*(){
		while(a > 0){
			try{
				yield this.save();
				break;
			}catch(err){
				a--;
			}
		}
	})();
};





exports.User = mongoose.model('User', User);




