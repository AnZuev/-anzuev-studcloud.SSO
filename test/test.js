'use strict';

let Q = require('q');

let config = require('../config');

const UAMS = require("@anzuev/studcloud.uams");


let sso = require('../index');
sso.init();

Q.async(function*(){
	let authData = {
		name: "Ant",
		password: "sdkmskdmsf",
		surname: "Zuev",
		mail: "anzuev123@bk.ru"
	};
	try{
		let user = yield* sso.signIn(authData);
		let context = {
			authData:authData
		};
		//let user = yield* UAMS.createUser(authData);
		let res = yield sso.checkPermissionToGetFile(user, '575eb3749ded7fef0bdbf08c');
		//let res = yield sso.setPasswordKey(authData.mail);
		//let res = yield sso.setPassword(authData.mail, authData.password, '');
		//let user = yield sso.confirmMail(authData.mail, '03df24bcce1e45b231876fe5b2c405b0a4940ebc');
		console.log(user);
	}catch(err){
		throw err;
	}
})().done();
