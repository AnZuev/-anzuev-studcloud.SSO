'use strict';

let log4js = require('log4js'),
	config = require('../../config/index');

log4js.configure({
	appenders: [
		{ type: 'file', filename: config.get("logs:SSO:path") || './logs/SSO.log', category: config.get("logs:SSO:label") ||'SSO' },
		{ type: 'console' }
	]
});

global.logger = log4js.getLogger('SSO');