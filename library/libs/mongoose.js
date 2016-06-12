/**
 * Created by anton on 17/02/15.
 */
var mongoose = require('mongoose');

var config = require('../../config');


module.exports = mongoose.createConnection(config.get('mongoose:mainDbUri'), config.get('mongoose:options'));


