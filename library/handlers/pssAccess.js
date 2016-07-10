'use strict';
let UAMS = require('@anzuev/studcloud.uams'),
	File = require('../models/File'),
	DbError = require("@anzuev/studcloud.errors").DbError,
	Util = require('util'),
	Mongoose = require('mongoose'),
	Q = require("q");


/**
 * Проверка можно ли пользователю скачивать/просматривать файл
 * @param user - пользователь(объект типа user)
 * @param fileId - идентификатор файла для просмотра
 * @returns {*}
 * @throws {DbError}, 404 - файл не найден
 * @throws {DbError}, 404 - если файл доступен только людям из группы и автор файла не был найден
 * @memberof module:SSO~SSO
 * @returns {boolean}, true - можно, false - нельзя
 */
function* checkPermission(user, fileId){
	File = File();
	fileId = Mongoose.Types.ObjectId(fileId);
		
	let file = yield File.getFileById(fileId);
	if(!file) throw new DbError(null, 404, "No file found");

	if(file.access.publicAccess){
		return true;
	}else{
		switch (file.access.cType){
			case "group":
				let author = yield UAMS.getUserById(file.author);
				if(!author) throw new DbError(null, 404, "No user found");
				return user.isInGroup(author.group);
				break;
			case "conversation":
				break;
		}
	}
}
exports.checkPermissionToViewFile = checkPermission;