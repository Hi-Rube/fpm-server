/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 9/1/14
 * Time: 2:08 PM
 * To change this template use File | Settings | File Templates.
 */
var gravatar = require('gravatar');
var fs = require('fs');
var collectionModules = require('../models/index').modules;
var collectionUser = require('../models/index').user;
var cache = require('../redismodels/index');

var filter = function (params) {
  return (/^[0-9a-zA-Z|-]+$/).exec(params);
}

var action = function (r) {
  var moduleName = r.params[0];
  var v = r.query['v'] || /.*/ig;
  if (filter(moduleName)) {
    var module = collectionModules.find({"modulesname": moduleName, "version.modulesInfo.version": v}).toArray();
    if (module.length === 0) {
      r.response.write('false-null');
      return;
    }
    var module = module[0];
    var count = module['version'].length;
    var backmodule = function (module, index) {
      module['modulespath'] = module['version'][index]['modulespath'];
      module['publishtime'] = module['version'][index]['publishtime'];
      module['modulesInfo'] = module['version'][index]['modulesInfo'];
    }
    for (i = 0; i <= count; i++) {
      if (i === count) {
        backmodule(module, count - 1);
        break;
      }
      if (module['version'][i]['modulesInfo']['version'] === v) {
        backmodule(module, i);
        break;
      }
    }
    delete module['version'];
    var user = collectionUser.findOne({_id: module['userid']});
    module['authorHead'] = gravatar.url(user.email, {s: 50}, true);
    module['authorName'] = user.username;
    var ma = null;
    if (ma = module['modulesInfo']['maintainers']) {
      for (var i = 0; i < ma.length; i++) {
        var memail = ma[i]['email'];
        if (memail) {
          ma[i]['head'] = gravatar.url(memail, {s: 50}, true);
        }
      }
    }
    if (fs.exists('./readme/' + moduleName + '/' + moduleName + '-' + module['modulesInfo']['version'] + '.md')) {
      var file = fs.open('./readme/' + moduleName + '/' + moduleName + '-' + module['modulesInfo']['version'] + '.md');
      var readme = file.readAll().toString();
      module['readme'] = readme;
    }
    module['star'] = -1;
    if (r.cookies['username']) {
      if (module['starreduser'].indexOf(r.cookies['username']) != -1) {
        module['star'] = 1;
      } else {
        module['star'] = 0;
      }
    }
    module['downloads'] = cache.moduleDownloads(moduleName).get();
    r.response.write(JSON.stringify(module));
  }
  else {
    r.response.write('false-fuck');
  }
}

var globalAction = function (r) {
  var q = r.query['module'] || '';
  var page = r.query['page'] || 1;
  var result = {
    'version.modulesInfo.name': 1,
    'version.modulesInfo.description': 1,
    'version.modulesInfo.version': 1,
    'version.modulesInfo.keywords': 1,
    downloadtime: 1,
    starlength: 1,
    username: 1,
    version:{$slice: -1}
  };
  var query = [
    {'version.modulesInfo.name': {$regex: q, $options: 'ig'}},
    {'version.modulesInfo.keywords': {$regex: q, $options: 'ig'}},
    {'version.modulesInfo.description': {$regex: q, $options: 'ig'}}
  ];
  var modules = collectionModules.find({$or: query}, result);
  modules = modules.skip((page - 1) * 10).limit(11).toArray();
  var m11 = null;
  if (modules.length === 11){
    m11 = modules.pop();
  }
  for (var i = 0; i < (modules.length > 10 ? 10 : modules.length); i++){
    if (modules[i]['version'][0]['modulesInfo']['name'] === q){
      var t = modules[i];
      modules[i] = modules[0];
      modules[0] = t;
      break;
    }
  }
  if (m11){
    modules.push(m11);
  }
  modules = {
    result:modules
  }
  r.response.write(JSON.stringify(modules));
}

exports.action = action;
exports.global = globalAction;