'use strict';

let Q = require('q');

let config = require('../config');

const UAMS = require("@anzuev/studcloud.uams");


let SSO = require('../index');
SSO.configure(config);


const logger = require('../library/libs/logger').getLogger();
Q.async(function*(){
	let authData = {
		name: "Ant",
		password: "sdkmskdmsf",
		surname: "Zuev",
		mail: "anzuev12jjnjnj3@bkfdf.ru"
	};
	try{
		//let user = yield* SSO.signIn(authData);
		let context = {
			authData:authData
		};
		let user = yield* UAMS.createUser(authData);
		let user1 = yield* UAMS.getUserByMail(authData.mail);
		let res = yield* SSO.checkPermissionToGetFile(user1, '575eb3749ded7fef0bdbf08c');
		//let user = yield sso.confirmMail(authData.mail, '03df24bcce1e45b231876fe5b2c405b0a4940ebc');
		console.log(res);
	}catch(err){
		throw err;
	}
})().done();
