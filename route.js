/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 8/28/14
 * Time: 1:16 AM
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');
var http = require("http");
var download = require('./routes/download');
var publish = require('./routes/publish')
var signup = require('./routes/signup');
var login = require('./routes/login');
var search = require('./routes/search');
var profile = require('./routes/profile');
var star = require('./routes/star');
var site = require('./routes/site_info');

module.exports = function(route){
  route['^/publish/([^\/]+)$'] = function(r){
    publish.action(r);
  };

  route['^/download/([^\/]+)$'] = function(r){
    download.action(r);
  };

  route['^/search/([^\/]+)$'] = function(r){
    search.action(r);
  };

  route['^/profile/([^\/]+)$'] = function(r){
    profile.action(r);
  };

  route['^/editprofile$'] = function(r){
    profile.updateProfile(r);
  }

  route['^/password$'] = function(r){
    profile.changePassword(r);
  }

  route['^/search$'] = function(r){
    search.global(r);
  };

  route['^/star/([^\/]+)$'] = function(r){
    star.action(r);
  };

  route['^/signup$'] = function(r){
    var params = JSON.parse(r.body.read().toString());
    var backInfo = signup.action(params,r);
    r.response.write(backInfo);
  };

  route['^/login$'] = function(r){
    var params = JSON.parse(r.body.read().toString());
    var backInfo = login.action(params,r);
    r.response.write(backInfo);
  };

  route['^/site/([^\/]+)$'] = function(r){
    site.action(r);
  }

  //static
  route['^/$'] = function(r){
    var file = fs.open('./static/index.html');
    r.response.write(file.readAll());
    file.close();
  };

  route['^/static/(.*)$'] = http.fileHandler('./static/');

  route['^/psignup$'] = function(r){
    var file = fs.open('./static/signup.html');
    r.response.write(file.readAll());
    file.close();
  };

  route['^/plogin$'] = function(r){
    var file = fs.open('./static/login.html');
    r.response.write(file.readAll());
    file.close();
  };

  route['^/pmodules/([^\/]+)$'] = function(r){
    var file = fs.open('./static/modules.html');
    r.response.write(file.readAll());
    file.close();
  };

  route['^/pprofile/([^\/]+)$'] = function(r){
    var file = fs.open('./static/profile.html');
    r.response.write(file.readAll());
    file.close();
  };

  route['^/peditprofile$'] = function(r){
    var file = fs.open('./static/edit_profile.html');
    r.response.write(file.readAll());
    file.close();
  };

  route['^/ppassword$'] = function(r){
    var file = fs.open('./static/password.html');
    r.response.write(file.readAll());
    file.close();
  };

  route['^/psearch'] = function(r){
    var file = fs.open('./static/search.html');
    r.response.write(file.readAll());
    file.close();
  };

  route['^/.*$'] = function(r){
    var file = fs.open('./static/html/404.html');
    r.response.write(file.readAll());
    file.close();
  }
}