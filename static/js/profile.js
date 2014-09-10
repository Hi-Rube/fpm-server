/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 9/3/14
 * Time: 8:52 PM
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function () {
  var pA = ('' + window.location).split('/');
  var userName = pA[pA.length - 1].split('#')[0];
  $('#title').html(userName);
  User = Backbone.Model.extend({
    url: '/profile/' + userName,
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
    success: function (model, response) {
      userView.render(model.attributes);
      $('#user_big_head').attr('src', model.attributes.head);
    },
    error: function () {
    }
  });
});