/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 9/9/14
 * Time: 12:09 AM
 * To change this template use File | Settings | File Templates.
 */
var db = require('db');
var config = require('../config');
var globalInfo = require('./global_info');
var selfInfo = require('./self_info');

var rdb = db.openRedis('redis://' + config.redis.host);

exports.allPackages = globalInfo.allPackages(rdb);
exports.allDownloads = globalInfo.allDownloads(rdb);
exports.mostInstall = globalInfo.mostInstall(rdb);
exports.mostStarred = globalInfo.mostStarred(rdb);
exports.famousPeople = globalInfo.famousPeople(rdb);
exports.updateRecent = globalInfo.updateRecent(rdb);

exports.moduleDownloads = function (modulesname){
  return selfInfo.moduleDownloads(rdb, modulesname);
}

exports.warm = function () {
  globalInfo.allDownloads(rdb).warm();
  globalInfo.allPackages(rdb).warm();
  globalInfo.mostInstall(rdb).warm();
  globalInfo.mostStarred(rdb).warm();
  globalInfo.famousPeople(rdb).warm();
  globalInfo.updateRecent(rdb).warm();
}

exports.allSiteInfo = function () {
  var siteInfo = {
    allPackages: JSON.parse(globalInfo.allPackages(rdb).get()),
    allDownloads: JSON.parse(globalInfo.allDownloads(rdb).get()),
    mostInstall: JSON.parse(globalInfo.mostInstall(rdb).get()),
    mostStarred: JSON.parse(globalInfo.mostStarred(rdb).get()),
    famousPeople: JSON.parse(globalInfo.famousPeople(rdb).get()),
    updateRecent: JSON.parse(globalInfo.updateRecent(rdb).get())
  };
  return JSON.stringify(siteInfo);
}