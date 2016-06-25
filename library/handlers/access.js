'use strict';

let AuthError = require("@anzuev/studcloud.errors").AuthError;

exports.checkAuth = function*(next){
	if(this.context.authLevel < 1){
		throw new AuthError(401, "Действие требует авторизации");
	}else{
		yield next;
	}
};


exports.checkMailActivation = function*(next){
	if(this.context.authLevel < 2) {
		throw new AuthError(405, "Действие требует подтверждения почтового адреса");
	}else{
		yield next;
	}
};

exports.checkMobileActivation = function*(next){
	if(this.context.authLevel < 3) {
		throw new AuthError(405, "Действие требует подтверждения номера телефона");
	}else{
		yield next;
	}
};

exports.checkDocumentActivation = function*(next){
	if(this.context.authLevel < 4) {
		throw new AuthError(405, "Действие требует подтверждения зачетной книжки");
	}else{
		yield next;
	}
};
