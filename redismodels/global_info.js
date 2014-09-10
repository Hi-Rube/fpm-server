/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 9/9/14
 * Time: 12:39 AM
 * To change this template use File | Settings | File Templates.
 */
var collectionModules = require('../models/index').modules;

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

var allPackages = function (rdb) {
  return {
    inc: function inc() {
      rdb.incr('#allPackages', 1);
    },
    get: function get() {
      var allN = rdb.get('#allPackages');
      if (!allN) {
        allN = this.warm();
      } else {
        allN = allN.toString();
      }
      return JSON.stringify({result: allN});
    },
    warm: function warm() {
      if (rdb.get('#allPackages')) {
        return;
      }
      var count = collectionModules.find({}).count();
      rdb.set('#allPackages', count + '');
      return count;
    }
  }
}

var allDownloads = function (rdb) {
  return {
    inc: function () {
      var downloadN = rdb.incr('#' + getDate(), 1);
      if (downloadN === 1) {
        rdb.expire('#' + getDate(), 8035200000);   //default ~3 months (3*31*24*3600*1000)
      }
    },
    get: function () {
      var date = getDate() - 1;
      var downloadInfo = rdb.get('#alldownloads' + date);
      if (downloadInfo) {
        return downloadInfo.toString();
      }
      var keys = [];
      for (var i = 0; i < 31; i++) {
        keys.push('#' + (date - i));
      }
      var vList = rdb.mget(keys).map(function (data) {
        var data = new Buffer(data + '').toString();
        return data;
      }).toArray();
      downloadInfo = JSON.stringify({result: vList});
      rdb.set('#alldownloads' + date, downloadInfo, 604800000); //default 1 week (7*24*3600*1000)
      return downloadInfo;
    },
    warm: function () {
      //TODO  redis AOF RDB  process.system();
    }
  }
}

var mostInstall = function (rdb) {
  return {
    get: function () {
      var mList = rdb.get('#mostInstall');
      if (!mList) {
        mList = this.warm();
      } else {
        mList = mList.toString();
      }
      return mList;
    },
    warm: function () {
      var mList = collectionModules.find({}, {modulesname: 1, _id: 0, downloadtime: 1}).sort({downloadtime: -1}).limit(10).toArray();
      mList = JSON.stringify({result: mList});
      rdb.set('#mostInstall', mList, 3600000);  //default ~1 hour
      return mList;
    }
  }
}

var mostStarred = function (rdb) {
  return {
    get: function () {
      var mList = rdb.get('#mostStarred');
      if (!mList) {
        mList = this.warm();
      } else {
        mList = mList.toString();
      }
      return mList;
    },
    warm: function () {
      var mList = collectionModules.find({}, {modulesname: 1, _id: 0, 'starlength': 1}).sort({'starlength': -1}).limit(10).toArray();
      mList = JSON.stringify({result: mList});
      rdb.set('#mostStarred', mList, 3600000);  //default ~1 hour
      return mList;
    }
  }
}

var famousPeople = function (rdb) {
  return {
    get: function () {
      var mList = rdb.get('#famousPeople');
      if (!mList) {
        mList = this.warm();
      } else {
        mList = mList.toString();
      }
      return mList;
    },
    warm: function () {
      var mList = collectionModules.find({}, {username: 1, _id: 0}).sort({'starlength': -1, 'downloadtime': -1}).limit(100).toArray();
      for (var i = 0; i < mList.length; i++) {
        mList[i] = mList[i]['username'];
      }
      mList.sort();
      var re = [mList[0]];
      for (var i = 1; i < mList.length; i++) {
        if (mList[i] !== re[re.length - 1]) {
          re.push(mList[i]);
        }
      }
      mList = JSON.stringify({result: re.slice(0, 10)});
      rdb.set('#famousPeople', mList, 3600000);  //default ~1 hour
      return mList;
    }
  }
}

var updateRecent = function (rdb) {
  return {
    get: function () {
      var mList = rdb.get('#updateRecent');
      if (!mList) {
        mList = this.warm();
      } else {
        mList = mList.toString();
      }
      return mList;
    },
    warm: function () {
      var mList = collectionModules.find({}, {modulesname: 1, _id: 0, 'updatetime': 1}).sort({'updatetime': -1}).limit(10).toArray();
      mList = JSON.stringify({result: mList});
      rdb.set('#updateRecent', mList, 60000);  //default ~1m
      return mList;
    }
  }
}

exports.allPackages = allPackages;
exports.allDownloads = allDownloads;
exports.mostInstall = mostInstall;
exports.mostStarred = mostStarred;
exports.famousPeople = famousPeople;
exports.updateRecent = updateRecent;