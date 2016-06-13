'use strict';

let Q = require('q'),
	Util = require('util'),
	DbError = require("@anzuev/studcloud.errors").DbError,
	AuthError = require("@anzuev/studcloud.errors").AuthError,
	Crypto = require('crypto'),
	Document = require("@anzuev/studcloud.datamodels").Document,
	connection = require('../../../connections').pss;

let AdmZip = require("adm-zip");

Document.statics.getDocumentById = function(id){
	return this.find(
		{
			_id: id
		}
	).exec();
};


Document.methods.toArchive = function(){
	let zip = new AdmZip();
	this.parts.forEach(function(part){

	})
};
module.exports = connection.model("Document", Document);



