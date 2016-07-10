'use strict';

let Q = require('q'),
	Util = require('util'),
	DbError = require("@anzuev/studcloud.errors").DbError,
	AuthError = require("@anzuev/studcloud.errors").AuthError,
	FileInterface = require("@anzuev/studcloud.fileinterface");

let connection;

module.exports = function(){
	connection = require('../../../connections').getConnections().pss;

	let fileInterface = new FileInterface();

	fileInterface.setConnection(connection);

	return fileInterface.get();
};




