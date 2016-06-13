'use strict';
let User = require('../models/User'),
	File = require('../models/File'),
	DbError = require("@anzuev/studcloud.errors").DbError,
	Util = require('util'),
	Mongoose = require('mongoose'),
	Q = require("q");

function checkPermission(user, fileId){
	return Q.async(function*(){
		fileId = Mongoose.Types.ObjectId(fileId);
		let file = yield File.getFileById(fileId);
		if(!file) throw new DbError(null, 404, "No file found");


		if(file.access.publicAccess){
			return true;
		}else{
			switch (file.access.cType){
				case "group":
					let author = yield User.getById(file.author);
					if(!author) throw new DbError(null, 404, "No user found");
					return user.isInGroup(author.group);
					break;
				case "conversation":

					break;
			}
		}
	})();
}
exports.checkPermissionToViewFile = checkPermission;