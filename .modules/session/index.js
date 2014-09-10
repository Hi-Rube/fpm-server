/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 9/3/14
 * Time: 1:28 AM
 * To change this template use File | Settings | File Templates.
 */
var util = require('util');
var session = new util.LruCache(100000, 3600000);

exports.put = function put(key, value) {
  session.put(key, value);
}

exports.get = function get(key) {
  return session.get(key);
}

exports.has = function has(key) {
  return session.has(key);
}