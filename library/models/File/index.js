'use strict';

let Q = require('q'),
	Util = require('util'),
	DbError = require("@anzuev/studcloud.errors").DbError,
	AuthError = require("@anzuev/studcloud.errors").AuthError,
	FileInterface = require("@anzuev/studcloud.fileinterface"),
	connection = require('../../../connections').pss;

let fileInterface = new FileInterface();

fileInterface.setConnection(connection);

module.exports = fileInterface.get();



