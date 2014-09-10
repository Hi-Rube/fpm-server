/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 9/3/14
 * Time: 9:12 PM
 * To change this template use File | Settings | File Templates.
 */
var gravatar = require('gravatar');
var http = require('http');
var md5 = require('hash').md5;
var collectionUser = require('../models/index').user;
var collectionModules = require('../models/index').modules;

var filter = function (params) {
  return (/^[0-9a-zA-Z|-]+$/).exec(params);
}

var action = function (r) {
  var userName = r.params[0];
  if (filter(userName)) {
    var user = collectionUser.findOne({username: userName}, {'password': 0});
    var result = {
      '_id': 0,
      'version.modulesInfo.name': 1,
      'version.modulesInfo.version': 1,
      'version.modulesInfo.description': 1,
      'version': {$slice: -1}
    }
    user['publish'] = collectionModules.find({'username': userName}, result);
    user['star'] = collectionModules.find({'starreduser':{$in:[userName]}}, result);
    if (user) {
      user['head'] = gravatar.url(user['email'], {s: 496}, true);
      r.response.write(JSON.stringify(user));
    } else {
      r.response.write('false-none');
    }
  } else {
    r.response.write('false-fuck');
  }
}

var updateProfile = function (r) {
  var params = JSON.parse(r.body.read().toString());
  params['password'] = md5(params['password']).digest().hex();
  var user = collectionUser.findOne({username: params['username'], password: params['password']});
  if (user) {
    user['email'] = params['email'];
    user['fullname'] = params['fullname'];
    user['github'] = params['github'];
    user['homepage'] = params['homepage'];
    user['weibo'] = params['weibo'];
    collectionUser.save(user);
    r.response.addCookie(new http.Cookie('fullname', params['fullname'], {path: '/'}));
    r.response.addCookie(new http.Cookie('head', gravatar.url(params['email'], {s: 50}, true), {path: '/'}));
    r.response.write(JSON.stringify({}));
  } else {
    r.response.write('false-none');
  }
}

var changePassword = function (r) {
  var oldpassword = md5(r.form['oldpassword']).digest().hex();
  var newpassword = md5(r.form['newpassword']).digest().hex();
  var username = r.cookies['username'];
  var user = collectionUser.findOne({password: oldpassword, username: username});
  if (user) {
    user['password'] = newpassword;
    collectionUser.save(user);
    r.response.write(JSON.stringify({}));
  } else {
    r.response.write('false-none');
  }
}

exports.action = action;
exports.updateProfile = updateProfile;
exports.changePassword = changePassword;