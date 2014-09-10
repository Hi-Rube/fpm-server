/**
 * Created with JetBrains WebStorm.
 * User: rube
 * Date: 9/4/14
 * Time: 5:23 PM
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function(){
  var userName = getCookie('username');
  var notice = function (str) {
    $("#notice").html(str);
    setTimeout(function () {
      $("#notice").html('&nbsp;')
    }, 1000);
  };
  $('#change').click(function(){
    var oldpassword = $('#f1').val();
    var newpassword = $('#f2').val();
    var vpassword = $('#f3').val();
    if (newpassword.length < 6){
      notice('Password\'s length must >=6');
      return;
    }
    if (vpassword != newpassword){
      notice('Verify password not equal with password');
      return;
    }
    $.ajax({
      type:'POST',
      url:'/password',
      data:{oldpassword:oldpassword, newpassword:newpassword},
      dataType:'json',
      success:function(data){
        window.location.href = '/pprofile/' + userName;
      },
      error:function(){
        notice('Current Password Error');
      }
    });
  });
});