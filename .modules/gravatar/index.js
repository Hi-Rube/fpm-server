/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 9/2/14
 * Time: 7:43 PM
 * To change this template use File | Settings | File Templates.
 */
var md5 = require('hash').md5;

var gravatar = module.exports = {
  url: function (email, options, https) {
    var baseURL = (https && "https://secure.gravatar.com/avatar/") || 'http://www.gravatar.com/avatar/';
    var queryData = '';
    for (var option in options) {
      queryData += option + '=' + options[option] + '&'
    }
    var query = (queryData && "?" + queryData) || "";
    return baseURL + md5(email.toLowerCase().trim()).digest().hex() + query;
  }
};