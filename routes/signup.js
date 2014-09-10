/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 8/30/14
 * Time: 12:51 AM
 * To change this template use File | Settings | File Templates.
 */
var http = require('http');
var session = require('session');
var gravatar = require('gravatar');
var md5 = require('hash').md5;
var collection = require('models').user;
var action = function (params, r) {
  var pA = ['username', 'password', 'email', 'fullname', 'github', 'homepage', 'weibo'];
  if (params['username'] && params['password'] && params['email'] &&
    params['fullname'] && params['github'] && params['homepage'] && params['weibo']) {
    var user = collection.findOne({$or: [
      {username: params['username']}
    ]})
    if (user) {
      return out('false-have');
    } else {
      user = {};
      params['password'] = md5(params['password']).digest().hex();
      for (var i = 0; i < pA.length; i++) {
        user[pA[i]] = params[pA[i]];
      }
      collection.insert(user);
      var expires = new Date();
      var sessionid = md5(expires.getTime() + '').digest().hex();
      session.put(sessionid, params['username']);
      expires.setTime(expires.getTime() + 3600000);
      r.response.addCookie(new http.Cookie('sessionid', sessionid, {expires: expires.toGMTString(), path: '/'}));
      r.response.addCookie(new http.Cookie('fullname', user['fullname'], {expires: expires.toGMTString(), path: '/'}));
      r.response.addCookie(new http.Cookie('head', gravatar.url(user['email'], {s: 50}, true), {expires: expires.toGMTString(), path: '/'}));
      r.response.addCookie(new http.Cookie('username', user['username'], {expires: expires, path: '/'}));
      return out({}, true);
    }
  }
}

var out = function (info, success) {
  if (success) {
    return JSON.stringify(info);
  }
  return info;
}

exports.action = action;