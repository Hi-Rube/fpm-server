/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 9/8/14
 * Time: 6:15 PM
 * To change this template use File | Settings | File Templates.
 */
var cache = require('../redismodels/index');

var action = function (r) {
  var m = r.params[0];
  switch (m) {
    case 'allPackages':
      r.response.write('' + cache.allPackages.get());
      break;
    case 'globalDownloads':
      r.response.write('' + cache.allDownloads.get());
      break;
    case 'mostInstall':
      r.response.write('' + cache.mostInstall.get());
      break;
    case 'mostStarred':
      r.response.write('' + cache.mostStarred.get());
      break;
    case 'famousPeople':
      r.response.write('' + cache.famousPeople.get());
      break;
    case 'allSiteInfo':
      r.response.write('' + cache.allSiteInfo());
      break;
  }
}

exports.action = action;