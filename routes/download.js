/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 8/28/14
 * Time: 7:12 PM
 * To change this template use File | Settings | File Templates.
 */
var http = require('http');
var fs = require('fs');
var collection = require('../models/index').modules;
var cache = require('../redismodels/index');

var filter = function (params) {
  return (/^[0-9a-zA-Z|-]+$/).exec(params);
}

var versionAnalyze = function (version) {
  if (!version || version === '*') {
    return {
      v: 0,
      t: -2
    }
  }
  if ((/(x|X)+/g).test(version)) {
    return {
      v: version.replace(/(x|X)+/g, '(\\d|.)+'),
      t: 2
    }
  }
  if ((/(>=|>)+/).test(version)) {
    return {
      v: version.replace(/(>=|>)+/g, ''),
      t: 1
    }
  }
  if ((/^~/).test(version)) {
    return {
      v: version.replace(/~/g, ''),
      t: 0
    }
  }
  if ((/(<=|<)+/).test(version)) {
    return {
      v: version.replace(/(<=|<)+/g, ''),
      t: -1
    }
  }
  return {
    v: version,
    t: 0
  }
}

var compVersion = function (v1, v2, type) {
  v1 = v1.split('.');
  v2 = v2.split('.');
  for (var i = 0; i < (v1.length < v2.length ? v1.length : v2.length); i++) {
    if (parseInt(v1[i]) === parseInt(v2[i])) {
      continue;
    }
    if (parseInt(v1[i]) > parseInt(v2[i])) {
      return 1;
    } else {
      return -1;
    }
  }
  return 0;
}

var findVersion = function (moduleArr, version) {
  var back = function (module, diff) {
    return {
      module: module,
      diff: diff
    }
  }
  if (version['t'] === -2) {
    return back(moduleArr[moduleArr.length - 1], 0);
  }
  for (var i = moduleArr.length - 1; i >= 0; i--) {
    var cv = function (index) {
      return compVersion(moduleArr[index]['modulesInfo']['version'], version['v']);
    }
    if (cv(i) === version['t']) {
      return back(moduleArr[i], 0);
    }
    if (version['t'] === 2) {
      var p = new RegExp('^' + version['v'] + '$', "gi");
      if (p.test(moduleArr[i]['modulesInfo']['version'])) {
        return back(moduleArr[i], 0);
      }
    }
    if (i < (moduleArr.length - 1) && version['t'] === 0 && cv(i + 1) != cv(i)) {
      return back(moduleArr[i], 0);
    }
  }
  return back(moduleArr[moduleArr.length - 1], 1);
}

var action = function (r) {
  var moduleName = r.params[0];
  if (!filter(moduleName)) {
    r.response.write('');
    return;
  }
  var v = versionAnalyze(r.query['v']);
  console.log(v);
  var q = {"modulesname": moduleName};
  var module = collection.find(q, {'version.modulesInfo.version': 1, 'version.modulespath': 1}).toArray();
  if (module.length != 0) {
    var module = findVersion(module[0]['version'], v);
    var file = fs.open('./repository' + module['module']['modulespath'], 'r');
    r.response.write(file.readAll());
    r.response.addCookie(new http.Cookie('version', module['module']['modulesInfo']['version']));  // 下下策
    r.response.addCookie(new http.Cookie('diff', module['diff']));  // 下下策
    file.close();
    collection.update({"modulesname": moduleName}, {$inc: {downloadtime: 1}}, false, true);
    cache.allDownloads.inc();
    cache.moduleDownloads(moduleName).inc();
  } else {
    r.response.write('');
  }
}

exports.action = action;