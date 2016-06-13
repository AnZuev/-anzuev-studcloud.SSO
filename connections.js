'use strict';

let mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;


var config = require('./config');
let usersCon,
	ssoCon,
	pssCon;



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


if(config.get("mongoose:PSSUri")){
	pssCon = mongoose.createConnection(config.get('mongoose:PSSUri'), config.get('mongoose:PSSOptions'));
}else{
	throw new Error("Can't connect to users collection. No mongoose:PSSUri property specified");
}
module.exports.pss = pssCon;