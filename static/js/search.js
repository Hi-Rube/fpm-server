/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 9/8/14
 * Time: 4:30 PM
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function () {
  var query = ('' + window.location).split('/').slice(-1)[0].split('?').slice(-1);
  var q = (/module=([a-zA-Z0-9|-]?)/i).exec(window.location.href);
  Module = Backbone.Model.extend({
    url: '/search?' + query
  });
  ModuleView = Backbone.View.extend({
    render: function (info) {
      var template = _.template($("#modules_info").html(), info);
      $("#content").html(template);
      $('#go').click(function(){
        var page = $('#gon').val();
        window.location.href = '/psearch?' + q[0] + '&page=' + page;
      });
    }
  });
  var modules = new Module;
  var modulsView = new ModuleView;
  modules.fetch({
    success: function (model, response) {
      model.attributes.next = '/psearch?' + query + '&'
      modulsView.render(model.attributes);
      if (model.attributes.result.length === 0){
        $('#content').html("<a class='g'>No Result</a>");
      }
    },
    error: function () {
      $('#content').html("<a class='g'>No Result</a>");
    }
  })
});