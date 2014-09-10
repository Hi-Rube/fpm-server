/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 8/30/14
 * Time: 3:53 PM
 * To change this template use File | Settings | File Templates.
 */
function getCookie(name) {
  var strCookie = document.cookie;
  var arrCookie = strCookie.split("; ");
  for (var i = 0; i < arrCookie.length; i++) {
    var arr = arrCookie[i].split("=");
    if (arr[0] == name)return arr[1];
  }
  return "";
}

window.onload = function () {
  var head = getCookie('head');
  var fullname = getCookie('fullname');
  var username = getCookie('username');
  $('#header_search input').focus(function () {
      $(this).val('');
    }
  );
  $('#header_search input').blur(function () {
     $(this).val('Search Modules');
  });
  $('#header_search input').blur();
  if (fullname && username && head) {
    $('#user_block img').attr('src', head);
    var afirst = $('#user_info a:first');
    var alast = $('#user_info a:last');
    afirst.html(fullname);
    alast.html('Edit My Profile');
    alast.css({'font-size': '11px'});
    afirst.css({'font-size': '16px'});
    afirst.attr('href', '/pprofile/' + username);
    alast.attr('href', '/peditprofile');
  }
}


