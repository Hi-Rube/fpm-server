/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 9/4/14
 * Time: 7:21 PM
 * To change this template use File | Settings | File Templates.
 */
var session = require('session');
var collectionStar = require('../models/index').modules;

var action = function (r) {
  var moduleName = r.params[0];
  var sessionid = r.cookies['sessionid'];
  if (session.has(sessionid)) {
    var username = session.get(sessionid);
    var t = parseInt(r.query.t);
    if (t === 0) {
      collectionStar.update({'modulesname': moduleName}, {$addToSet: {starreduser: username}, $inc: {starlength: 1}}, true);
    } else if (t === 1) {
      collectionStar.update({'modulesname': moduleName}, {$pull: {starreduser: username}, $inc: {starlength: -1}});
    }
    r.response.write('{}');
  } else {
    r.response.write('false-none');
  }
}

exports.action = action;