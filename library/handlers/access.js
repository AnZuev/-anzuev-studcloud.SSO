

exports.checkAuth = function(req, res, next){
	if(req.context.authLevel < 1){
		return next(401);
	}else{
		return next();
	}
};

exports.checkMailActivation = function(req, res, next){
	if(req.context.authLevel < 2) {
		return next(405);
	}else{
		return next();
	}
};

exports.checkMobileActivation = function(req, res, next){
	if(req.context.authLevel < 3) {
		return next(405);
	}else{
		return next();
	}
};

exports.checkDocumentActivation = function(req, res, next){
	if(req.context.authLevel < 4) {
		return next(405);
	}else{
		return next();
	}
};
