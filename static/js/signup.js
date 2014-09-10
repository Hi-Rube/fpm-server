/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 8/30/14
 * Time: 6:44 PM
 * To change this template use File | Settings | File Templates.
 */
var step1 = function () {
  var username = $('#f1').val();
  var password = $('#f2').val();
  var vpassword = $('#f3').val();
  var email = $('#f4').val();
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

  if (password != vpassword) {
    notice('Verify password not equal with password');
    return;
  }

  if (!(/^.+@.+$/).exec(email)) {
    notice('Email format Error');
    return;
  }
  user.set({username: username, password: password, email: email});
  step = 2;
  changeToStep2();
}

var step2 = function () {
  var fullname = $('#f1').val();
  var weibo = $('#f2').val() ? $('#f2').val() : '-';
  var github = $('#f3').val() ? $('#f3').val() : '-';
  var homepage = $('#f4').val() ? $('#f4').val() : '-';
  var notice = function (str) {
    $("#notice").html(str);
    setTimeout(function () {
      $("#notice").html('&nbsp;')
    }, 1000);
  }
  if (!(/^[0-9a-z|-]+$/).exec(fullname)) {
    notice('Full Name format Error');
    return;
  }
  if (fullname.length < 3) {
    notice('fullname\'s length must >=3');
    return;
  }
  user.set({fullname: fullname, weibo: weibo, github: github, homepage: homepage});
  user.save({}, {success: function () {
    window.location.href = '/';
  }, error: function () {
    notice('The user has been registered');
    step = 1;
    changeToStep1();
  }});
}

var changeToStep1 = function () {
  var strA = ['Username', 'Password', 'Verify Password', 'Email Address'];
  for (var i = 0; i < strA.length; i++) {
    $("#i" + (i + 1)).html(strA[i]);
    $("#f" + (i + 1)).val('');
  }
  $('#title').html('Fpm Account Sign Up (Step 1)');
}

var changeToStep2 = function () {
  var strA = ['Full Name', 'WeiBo | Twitter', 'Github', 'Home Page'];
  for (var i = 0; i < strA.length; i++) {
    $("#i" + (i + 1)).html(strA[i]);
    $("#f" + (i + 1)).val('');
  }
  $('#title').html('Fpm Account Sign Up (Step 2)');
}

$(document).ready(function () {
  step = 1;
  User = Backbone.Model.extend({
    url: '/signup',
    default: {
      username: '',
      password: '',
      fullname: '',
      weibo: '-',
      email: '',
      github: '-',
      homepage: '-'
    }
  });
  user = new User;
  $("#sign").click(function () {
    if (step === 1) {
      step1();
      return;
    }

    if (step === 2) {
      step2();
      return;
    }
  });
});

