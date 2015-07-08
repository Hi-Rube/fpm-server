/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 9/1/14
 * Time: 2:05 PM
 * To change this template use File | Settings | File Templates.
 */
var star = -1;
$(document).ready(function () {
  var pA = ('' + window.location).split('/');
  moduleName = pA[pA.length - 1].split('#')[0];
  $('#title_a').html(moduleName.split('?')[0]);
  Module = Backbone.Model.extend({
    url: '/search/' + moduleName,
    default: {

    }
  });
  ModuleView = Backbone.View.extend({
    render: function (info) {
      console.log($("#module_info").html());
      console.log(info);
      var template = _.template($("#module_info").html(), info);
      $("#content").html(template);
    }
  });
  module = new Module;
  moduleView = new ModuleView();
  module.fetch({
    success: function (model, response) {
      moduleView.render(model.attributes);
      if (model.attributes.readme) {
        star = model.attributes['star'];
        if (star === 1) {
          $('#starbtn').html('unStar');
          $('#starbtn').attr('class', 'unstar');
        }
        var text = model.attributes.readme;
        var converter = new Showdown.converter();
        var html = converter.makeHtml(text);
        $('#readme').html(html);
      }
    },
    error: function () {
      $("#title").html('Not Found');
    }
  });
  $('#starbtn').click(function () {
    if (star === -1) {
      window.location.href = '/plogin';
      return;
    }
    $.ajax({
      type: 'GET',
      url: '/star/' + moduleName + '?t=' + star,
      dataType: 'json',
      success: function (data) {
        if (star === 0) {
          $('#starbtn').html('unStar');
          $('#starbtn').attr('class', 'unstar');
          star = 1;
        } else if (star === 1) {
          $('#starbtn').html('Star');
          $('#starbtn').attr('class', 'star');
          star = 0;
        }
      },
      error: function () {
        window.location.href = '/plogin';
      }
    });
  });
});