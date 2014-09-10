/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 8/29/14
 * Time: 12:11 PM
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');
var md5 = require('hash').md5;
var collectionUser = require('../models/index').user;
var collectionModules = require('../models/index').modules;
var Modules = require('../models/modules');
var cache = require('../redismodels/index');

var auth = function (username, password) {
  var password = md5(password).digest().hex();
  var user = collectionUser.findOne({username: username, password: password});
  if (user) {
    return user;
  }
  return false;
}

var authModule = function (modulesVersion, modulesName, user) {
  var modules = collectionModules.findOne({modulesname: modulesName});
  if (modules && modules['userid'].toString() != user['_id'].toString()) {
    return false;
  }
  if (modules && modules['userid'].toString() === user['_id'].toString()) {
    var version = collectionModules.findOne({"modulesname": modulesName, "version.modulesInfo.version": modulesVersion});
    if (version) {
      return false;
    }
  }
  if (!modules) {
    modules = [];
  }
  return modules;
}

var action = function (r) {
  if (!(r.form['username'] && r.form['password'] && r.form['fpm'] && r.form['moduleInfo'])) {
    return;
  }
  var user = auth(r.form['username'], r.form['password']);
  if (!user) {
    r.response.status = 401;
    return;
  }
  var modulesInfo = JSON.parse(r.form['moduleInfo']);
  var modulesname = modulesInfo.name;
  var modulesversion = modulesInfo.version;
  var modules = authModule(modulesInfo.version, modulesname, user);
  if (!modules) {
    r.response.status = 406;
    return;
  }
  var packet = r.form['fpm'].body.readAll();
  if (!fs.exists('./repository/' + modulesname)) {
    fs.mkdir('./repository/' + modulesname);
  }
  if (!fs.exists('./readme/' + modulesname)) {
    fs.mkdir('./readme/' + modulesname);
  }
  var f = fs.open('./repository/' + modulesname + '/' + modulesname + '-' + modulesversion + '.tar.gz', 'w');
  f.write(packet);
  f.close();
  if (r.form['readme']) {
    f = fs.open('./readme/' + modulesname + '/' + modulesInfo.name + '-' + modulesInfo.version + '.md', 'w');
    f.write(r.form['readme']);
    f.close();
  }

  Modules['userid'] = user['_id'];
  Modules['username'] = user['username'];
  Modules['modulesname'] = modulesname;
  Modules['version'][0]['modulespath'] = '/' + modulesname + '/' + modulesname + '-' + modulesversion + '.tar.gz';
  var dstr = new Date().getTime() + '';
  Modules['version'][0]['publishtime'] = dstr;
  Modules['updatetime'] = dstr;
  Modules['version'][0]['modulesInfo'] = modulesInfo;
  var newModulesFlag = false;
  if (modules.length === 0) {
    modules = Modules;
    newModulesFlag = true;
  } else {
    modules = {
      $set:{updatetime: dstr},
      $addToSet: {version: Modules['version'][0]}
    }
  }
  collectionModules.update({modulesname: modulesname}, modules, true);
  if (newModulesFlag){
    cache.allPackages.inc();
  }
}

exports.action = action;