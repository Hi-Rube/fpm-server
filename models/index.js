/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 8/28/14
 * Time: 7:19 PM
 * To change this template use File | Settings | File Templates.
 */
var db = require('db');
var config = require('../config');

var mdb = db.openMongoDB('mongodb://' + config.mongodb.host + '/' + config.mongodb.db);

exports.user = mdb.getCollection('user');
exports.modules = mdb.getCollection('modules');