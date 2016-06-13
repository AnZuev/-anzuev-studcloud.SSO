'use strict';

let Q = require('q'),
	Util = require('util'),
	DbError = require("@anzuev/studcloud.errors").DbError,
	AuthError = require("@anzuev/studcloud.errors").AuthError,
	File = require("@anzuev/studcloud.datamodels").File,
	connection = require('../../../connections').pss;

File.statics.getById = function(id){
	let defer = Q.defer();

	let promise = this.findOne(
		{
			_id: id
		}
	).exec();

	promise.then(function(file){
		if(file){
			defer.resolve(file);
		}else{
			defer.reject(new DbError(null, 404, Util.format("No file found by id = ", id)));
		}
	}).catch(function(err){
		defer.reject(new DbError(err, 500));
	});
	return defer.promise;
};

module.exports = connection.model("File", File);



