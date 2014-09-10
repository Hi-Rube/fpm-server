/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 8/30/14
 * Time: 10:07 PM
 * To change this template use File | Settings | File Templates.
 */
var http = require('http');
var session = require('session');
var gravatar = require('gravatar');
var md5 = require('hash').md5;
var collectionUser = require('../models/index').user;

var auth = function (username, password) {
  var password = md5(password).digest().hex();
  var user = collectionUser.findOne({username: username, password: password});
  if (user) {
    return user;
  }
  return false;
}

var action = function (params, r) {
  var username = params['username'];
  var password = params['password'];
  var user = null;
  if (user = auth(username, password)) {
    var expires = new Date();
    var sessionid = md5(expires.getTime()+'').digest().hex();
    session.put(sessionid, user['username']);
    expires.setTime(expires.getTime() + 36000000);
    r.response.addCookie(new http.Cookie('sessionid', sessionid, {expires: expires, path: '/'}));
    r.response.addCookie(new http.Cookie('fullname', user['fullname'], {expires: expires, path: '/'}));
    r.response.addCookie(new http.Cookie('head', gravatar.url(user['email'],{s:50},true), {expires: expires, path: '/'}));
    r.response.addCookie(new http.Cookie('username', user['username'], {expires: expires, path: '/'}));
    return JSON.stringify({});
  }
  return 'false-error';
}

exports.action = action;
exports.auth = auth;