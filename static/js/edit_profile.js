/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 9/3/14
 * Time: 10:43 PM
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function () {
  userName = getCookie('username');
  User = Backbone.Model.extend({
    url: '/editprofile',
    default: {
    }
  });
  UserView = Backbone.View.extend({
    render: function (info) {
      var template = _.template($("#my_info").html(), info);
      $("#content").html(template);
    }
  });
  var user = new User();
  var userView = new UserView;
  user.fetch({
    url: '/profile/' + userName,
    success: function (model, response) {
      userView.render(model.attributes);
      $('#user_big_head').attr('src', model.attributes.head);
      $('#save').click(function () {
          var notice = function (str) {
            $("#notice").html(str);
            setTimeout(function () {
              $("#notice").html('&nbsp;')
            }, 1000);
          }
          var m = {};
          var pA = ['fullname', 'email', 'weibo', 'github', 'homepage', 'password'];
          for (var i = 0; i < pA.length; i++) {
            var v = $('#f' + (i + 1)).val();
            m[pA[i]] = (/^\s+$/).exec(v) ? '-' : v;
          }
          if (!(/^[0-9a-z|-]+$/).exec(m['fullname'])) {
            notice('Full Name format Error');
            return;
          }
          if (m['fullname'].length < 3) {
            notice('fullname\'s length must >=3');
            return;
          }
          if (m['password'].length < 6) {
            notice('Password Error');
            return;
          }
          if (!(/^.+@.+$/).exec(m['email'])) {
            notice('Email format Error');
            return;
          }
          user.set(m);
          user.save({}, {
            success: function () {
              window.location.href = '/pprofile/' + userName;
            },
            error: function () {
              notice('Password error');
            }
          });
        }
      );
    },
    error: function () {
    }
  });
});
