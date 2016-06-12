'use strict';

let mongoose = require('mongoose');

var config = require('./config/index.js');
let usersCon,
	ssoCon;

if(config.get("mongoose:SSOUri")){
	ssoCon = mongoose.createConnection(config.get('mongoose:SSOUri'), config.get('mongoose:SSOOptions'));
}else{
	throw new Error("Can't connect to sso collection. No mongoose:SSOUri property specified");
}
module.exports.sso = ssoCon;


if(config.get("mongoose:UsersUri")){
	usersCon = mongoose.createConnection(config.get('mongoose:UsersUri'), config.get('mongoose:UsersOptions'));
}else{
	throw new Error("Can't connect to users collection. No mongoose:UsersUri property specified");
}
module.exports.users = usersCon;