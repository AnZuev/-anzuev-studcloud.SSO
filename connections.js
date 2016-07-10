'use strict';

let mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;


let usersCon,
	ssoCon,
	pssCon;

module.exports.configure = function(config){
	if(config.get("mongoose:SSOUri")){
		ssoCon = mongoose.createConnection(config.get('mongoose:SSOUri'), config.get('mongoose:SSOOptions'));
	}else{
		throw new Error("Can't connect to sso collection. No mongoose:SSOUri property specified");
	}


	if(config.get("mongoose:UsersUri")){
		usersCon = mongoose.createConnection(config.get('mongoose:UsersUri'), config.get('mongoose:UsersOptions'));
	}else{
		throw new Error("Can't connect to users collection. No mongoose:UsersUri property specified");
	}


	if(config.get("mongoose:PSSUri")){
		pssCon = mongoose.createConnection(config.get('mongoose:PSSUri'), config.get('mongoose:PSSOptions'));
	}else{
		throw new Error("Can't connect to users collection. No mongoose:PSSUri property specified");
	}
};

module.exports.getConnections = function(){
	if(!(usersCon && ssoCon && pssCon)) throw new Error('Connections have not been configured');
	return {
		users: usersCon,
		sso: ssoCon,
		pss: pssCon
	}
};
