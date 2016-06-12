'use strict';

let Q = require('q');

let config = require('../config');




let sso = require('../index');
sso.init();

Q.async(function*(){
	let authData = {
		name: "Ant",
		password: "sdkmskdmsf",
		surname: "Zuev",
		mail: "anzuev@bk.ru"
	};
	try{
		//let user = yield sso.signUp(authData);
		//user = yield sso.signIn(authData);

		let res = yield sso.setPasswordKey(authData.mail);
		//let res = yield sso.setPassword(authData.mail, authData.password, '');
		//let user = yield sso.confirmMail(authData.mail, '03df24bcce1e45b231876fe5b2c405b0a4940ebc');
		console.log(res);
	}catch(err){
		console.error(err);
	}
})().done();
