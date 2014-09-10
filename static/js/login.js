/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 8/31/14
 * Time: 11:10 PM
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function () {
  User = Backbone.Model.extend({
    url: '/login',
    default: {
      username: '',
      password: ''
    }
  });
  user = new User;
  $("#sign").click(function () {
    var username = $('#f1').val();
    var password = $('#f2').val();
    var notice = function (str) {
      $("#notice").html(str);
      setTimeout(function () {
        $("#notice").html('&nbsp;')
      }, 1000);
    }
    if (!(/^[0-9a-z]+$/).exec(username)) {
      notice('Username format Error');
      return;
    }

    if (username.length < 3) {
      notice('username\'s length must >=3 ');
      return;
    }
    if (password.length < 6) {
      notice('password\'s length must >=6');
      return;
    }
    user.set({username: username, password: password});
    user.save({}, {success: function () {
      window.location.href = '/';
    }, error: function () {
      notice('Password || Username Error');
    }});
  });
});

