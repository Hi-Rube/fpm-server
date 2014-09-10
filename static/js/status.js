/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 9/9/14
 * Time: 11:51 PM
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function getWebsiteInfo(){
  Website = Backbone.Model.extend({
    url: '/site/allSiteInfo'
  });
  WebsiteView = Backbone.View.extend({
    render: function (info) {
      var template = _.template($("#websiteInfo").html(), info);
      $("#content").html(template);
    }
  });

  var website = new Website;
  var websiteView = new WebsiteView;
  website.fetch({
    success: function(model, response){
      websiteView.render(model.attributes);
    },
    error: function(){
    }
  });
});