/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 9/10/14
 * Time: 1:40 AM
 * To change this template use File | Settings | File Templates.
 */
var getDate = function () {
  var dateArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  var result = 0;
  for (var i = 0; i < month; i++) {
    result += dateArr[i];
  }
  result += day;
  if (month > 1 && (year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
    result += 1;
  }
  return result;
}

var moduleDownloads = function (rdb, modulesname) {
  return {
    inc: function () {
      var downloadN = rdb.incr(modulesname + '#' + getDate(), 1);
      if (downloadN === 1) {
        rdb.expire(modulesname + '#' + getDate(), 8035200000);   //default ~3 months (3*31*24*3600*1000)
      }
    },
    get: function () {
      var date = getDate() - 1;
      var downloadInfo = rdb.get(modulesname + '#alldownloads' + date);
      if (downloadInfo) {
        return JSON.parse(downloadInfo);
      }
      var keys = [];
      for (var i = 0; i < 31; i++) {
        keys.push(modulesname + '#' + (date - i));
      }
      var vList = rdb.mget(keys).map(function (data) {
        var data = new Buffer(data + '').toString();
        return data;
      }).toArray();
      downloadInfo = JSON.stringify({result: vList});
      rdb.set(modulesname + '#alldownloads' + date, downloadInfo, 604800000); //default 1 week (7*24*3600*1000)
      return JSON.parse(downloadInfo);
    },
    warm: function () {
      //TODO  redis AOF RDB  process.system();
    }
  }
}

exports.moduleDownloads = moduleDownloads;