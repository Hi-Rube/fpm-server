/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 8/28/14
 * Time: 1:08 AM
 * To change this template use File | Settings | File Templates.
 */
var http = require('http');
var mq = require('mq');
var config = require('./config')
var Route = require('./route');
var redis = require('./redismodels/index');

var route = {};
Route(route);
redis.warm();      //cache warm start

var svr = new http.Server(config.port, new mq.Routing(route));
svr.run();