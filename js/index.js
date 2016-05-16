toggleFab();

var oldHTML = '';
var email,html,cacheHTML,pageLoad=false,chatCount=0;

if(readCookie('fab_chat_email') != null && readCookie('fab_chat_username') != null){
  var fst_alfa = readCookie('fab_chat_username');
  fst_alfa = fst_alfa[0].toLowerCase();
  var img = "<i class='zmdi zmdi-"+fst_alfa+"'></i>";
  setInterval(function(){ checkUpdate() }, 3000);
}

function logout(){
  eraseCookie('fab_chat_email');
  eraseCookie('fab_chat_username');
  logUser();
}
//getChat();
//checkUpdate();

//define chat color
if (typeof(Storage) !== "undefined") {
  if (localStorage.getItem('fab-color') === null) {
    localStorage.setItem("fab-color", "blue");
  }
  $('.fabs').addClass(localStorage.getItem("fab-color"));
} else {
  $('.fabs').addClass("blue");
}

//Fab click
$('#prime').click(function() {
  toggleFab();
});

//Speak admin msg
function botSpeak(text) {
  if ('speechSynthesis' in window) {
    var msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
  }
}

//Toggle chat and links
function toggleFab() {
  $('.prime').toggleClass('zmdi-plus');
  $('.prime').toggleClass('zmdi-close');
  $('.prime').toggleClass('is-active');
  $('#prime').toggleClass('is-float');
  $('.chat').toggleClass('is-visible');
  $('.fab').toggleClass('is-visible');
  
}

//User msg
function userSend(text) {
  var d = new Date();
  var fst_alfa = readCookie('fab_chat_username');
  fst_alfa = fst_alfa[0].toLowerCase();
  var img = '<i class="zmdi zmdi-'+fst_alfa+'"></i>';
  var html = '';

  html += '<div title="'+d.getFullYear() +'-'+ d.getMonth()+1 +'-'+ d.getDate() +' '+ d.getHours() +':'+  d.getMinutes() +':'+  d.getSeconds() +'"><div class="chat_avatar">' + img + '</div>' + text +' @'+ readCookie('fab_chat_username') + '</div>';
  postChat(text);
  $('#chatSend').val('');
  $('#fab_listen').removeClass('objblink active');
}

//Admin msg
function adminSend(text) {
  $('#chat_converse').append('<div class="chat_msg_item chat_msg_item_admin"><div class="chat_avatar"><i class="zmdi zmdi-headset-mic"></i></div>' + text + '</div>');
  botSpeak(text);
  if ($('.chat_converse').height() >= 256) {
    $('.chat_converse').addClass('is-max');
  }
  $('.chat_converse').scrollTop($('.chat_converse')[0].scrollHeight);
}

function getChat(){
  if(readCookie('fab_chat_email') != null && readCookie('fab_chat_username') != null){
    $.ajax({
      url: "log.json",
      cache: false,
      dataType: "HTML",
      success: function(response){
        response = '['+response+']';
        response = $.parseJSON(response);
        var notification_username = '';
        var notification_text = '';
        if(response.length > 0){
          newHTML = '';
          $.each(response,function(i,resp){
            resp_img = $.parseHTML(resp.img);
            resp_img = resp_img[0].data;
            email = resp.email;
            if(email != readCookie('fab_chat_email')){
                outPut = '<div class="chat_msg_item chat_msg_item_admin" title="'+resp.date+'"><div class="chat_avatar">' + resp_img + '</div>' + resp.text +' @'+ resp.username + '</div>';
                newHTML += outPut;
                cacheHTML = outPut;

                notification_username = resp.username;
                notification_text = resp.text;

            } else {
                outPut = '<div class="chat_msg_item chat_msg_item_user" title="'+resp.date+'"><div class="chat_avatar">' + resp_img + '</div>' + resp.text +' @'+ resp.username + '</div>';
                newHTML += outPut;
                cacheHTML = outPut;

                notification_username = resp.username;
                notification_text = resp.text;

            }
          });
          
          if(oldHTML != newHTML){
            oldHTML = newHTML;
            if(pageLoad){
              $('#chat_converse').append(cacheHTML);
            } else {
              if(notification_username != readCookie('fab_chat_username')) notification(notification_username,notification_text);
              $('#chat_converse').html(oldHTML);
            }
            //loadBeat(true);
            if(readCookie('fab_chat_email') != null && readCookie('fab_chat_email') != email){
              blickChatBoxHeader()
            }
            if ($('.chat_converse').height() >= 256) {
              $('.chat_converse').addClass('is-max');
            }
            $('.chat_converse').scrollTop($('.chat_converse')[0].scrollHeight);
          }
        }
      }
    });
  }
}
function postChat(text){
  if(readCookie('fab_chat_email') != null && readCookie('fab_chat_username') != null){
    var d = new Date();
    var date = d.getFullYear() +'-'+ d.getMonth()+1 +'-'+ d.getDate() +' '+ d.getHours() +':'+  d.getMinutes() +':'+  d.getSeconds();

    $.ajax({
      url: "post.php",
      cache: false,
      type: "POST",
      dataType: "html",
      data: {date:date, img:img, text:text, username:readCookie('fab_chat_username'), email:readCookie('fab_chat_email')},
      success: function(html){
        postUpdate()
      }
    });
  }
}

function checkUpdate(){
  if(readCookie('fab_chat_email') != null && readCookie('fab_chat_username') != null){
    $.ajax({
      url: 'post.php',
      type: 'POST',
      dataType: 'json',
      data: {is_updated:chatCount,type:'get'},
      success: function(hasUpdate){
        if(hasUpdate > chatCount) {
          chatCount = hasUpdate;
          getChat();
          
        }
      }
    });
  }
}

function postUpdate(){
  if(readCookie('fab_chat_email') != null && readCookie('fab_chat_username') != null){
    $.ajax({
      url: 'post.php',
      type: 'POST',
      dataType: 'json',
      data: {is_updated:chatCount,type:'post'},
      success: function(hasUpdate){
        checkUpdate();
      }
    });
    
  }
}

function blickChatBoxHeader(){
  loadBeat(true);
  //$('.chat_header').addClass('objblink');
}

function stopBlickChatBoxHeader(){
  loadBeat(false);
  $('#fab_listen').removeClass('objblink active');
  //$('.chat_header').removeClass('objblink');
}

var isOldTitle = true;
var oldTitle = "oldTitle";
var newTitle = "newTitle";
function blinkTitle(){
  setTimeout(changeTitle(), 700);
}

function changeTitle() {
  document.title = isOldTitle ? oldTitle : newTitle;
  isOldTitle = !isOldTitle;
  setTimeout(changeTitle, 700);
}

$('.chat_header span:not(.chat_color)').on('click',function(){
  if(readCookie('fab_chat_username') != null){
    $('.chat_converse,.fab_field,.chat_option').toggle();
  } else {
    $('.chat_login').toggle();
  }
});

//Send input using enter and send key
$('#chatSend').bind("enterChat", function(e) {
  stopBlickChatBoxHeader();
  userSend($('#chatSend').val());
  //adminSend('How may I help you.');
});
$('#fab_send').bind("enterChat", function(e) {
  stopBlickChatBoxHeader();
  userSend($('#chatSend').val());
  //adminSend('How may I help you.');
});
$('#chatSend').keypress(function(event) {
  stopBlickChatBoxHeader();
  if (event.keyCode === 13) {
    event.preventDefault();
    if (jQuery.trim($('#chatSend').val()) !== '') {
      $(this).trigger("enterChat");
    }
  }
});

$('#fab_send').click(function(e) {
  stopBlickChatBoxHeader();
  if (jQuery.trim($('#chatSend').val()) !== '') {
    $(this).trigger("enterChat");
  }
});

$('#chatSend').focus(function(){
  stopBlickChatBoxHeader();
});

//Listen user voice
$('#fab_listen').click(function() {
  stopBlickChatBoxHeader();
  $(this).addClass('objblink active');
  var recognition = new webkitSpeechRecognition();
  recognition.onresult = function(event) {
    userSend(event.results[0][0].transcript);
  }
  recognition.start();
});

// Color options
$(".chat_color").click(function(e) {
  $('.fabs').removeClass(localStorage.getItem("fab-color"));
  $('.fabs').addClass($(this).attr('color'));
  localStorage.setItem("fab-color", $(this).attr('color'));
});

$('.chat_option').click(function(e) {
  $(this).toggleClass('is-dropped');
});

//Loader effect
function loadBeat(beat) {
  beat ? $('.chat_loader').addClass('is-loading') : $('.chat_loader').removeClass('is-loading');
  if(beat){
    $('.chat .chat_converse .chat_msg_item:last')
                .css({'-webkit-animation':'zoomIn .5s cubic-bezier(.42, 0, .58, 1)','animation':'zoomIn .5s cubic-bezier(.42, 0, .58, 1)'}).end()
                .find('.chat_avatar:last').css({'-moz-animation':'bounceOut .6s linear','animation':'bounceOut .6s linear'});
  }
}

// Ripple effect
var target, ink, d, x, y;
$(".fab").click(function(e) {
  target = $(this);
  //create .ink element if it doesn't exist
  if (target.find(".ink").length == 0)
    target.prepend("<span class='ink'></span>");

  ink = target.find(".ink");
  //incase of quick double clicks stop the previous animation
  ink.removeClass("animate");

  //set size of .ink
  if (!ink.height() && !ink.width()) {
    //use parent's width or height whichever is larger for the diameter to make a circle which can cover the entire element.
    d = Math.max(target.outerWidth(), target.outerHeight());
    ink.css({
      height: d,
      width: d
    });
  }

  //get click coordinates
  //logic = click coordinates relative to page - parent's position relative to page - half of self height/width to make it controllable from the center;
  x = e.pageX - target.offset().left - ink.width() / 2;
  y = e.pageY - target.offset().top - ink.height() / 2;

  //set the position and add class .animate
  ink.css({
    top: y + 'px',
    left: x + 'px'
  }).addClass("animate");
});

//Cookies handler
function createCookie(name, value, days) {
  var expires;

  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toGMTString();
  } else {
    expires = "";
  }
  document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
  var nameEQ = encodeURIComponent(name) + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name, "", -1);
}

//User login
function logUser() {
  hideChat(true);
  $('#chat_send_email').click(function(e) {
    var email = $('#chat_log_email').val();
    if (jQuery.trim(email) !== '' && validateEmail(email)) {
      $('.chat_login_alert').html('');
      loadBeat(true);
      if (checkEmail(email)) {
        hideChat(false);
        $('.chat_login_alert').html('Email is taken.');
      } else {
        createCookie('fab_chat_email', email, 100);
        setTimeout(createUsername, 3000);
      }
    } else {
      $('.chat_login_alert').html('Invalid email.');
    }
  });
}

function createUsername() {
  loadBeat(false);
  $('#chat_log_email').val('');
  $('#chat_send_email').children('i').removeClass('zmdi-email').addClass('zmdi-account');
  $('#chat_log_email').attr('placeholder', 'Username');
  $('#chat_send_email').attr('id', 'chat_send_username');
  $('#chat_log_email').attr('id', 'chat_log_username');
  $('#chat_send_username').click(function(e) {
    var username = $('#chat_log_username').val();
    if (jQuery.trim(username) !== '') {
      loadBeat(true);
      if (checkUsername(username)) {
        $('.chat_login_alert').html('Username is taken.');
      } else {
        createCookie('fab_chat_username', username, 100);
        hideChat(false);
      }
    } else {
      $('.chat_login_alert').html('Please provide username.');
    }
  });
}

function hideChat(hide) {
  if (hide) {
    $('.chat_converse').css('display', 'none');
    $('.fab_field').css('display', 'none');
    $('#fab_logout').css('display', 'none');
    loadBeat(false);
  } else {
    $('#chat_head').html(readCookie('fab_chat_username'));
    // Help
    $('#fab_help').click(function(){userSend('Help!');});
    $('#fab_logout').css('display', 'block');
    $('#fab_logout').click(function(){logout();});
    $('.chat_login').css('display', 'none');
    $('.chat_converse').css('display', 'block');
    $('.fab_field').css('display', 'inline-block');
    checkUpdate();
  }
}

function checkEmail(email) {
  //check if email exist in DB
  $.ajax({
    url: 'post.php',
    type: 'POST',
    dataType: 'json',
    data: {is_login:'true',email:email},
    success: function(exist){
      if(exist=='true') {
        return true;
      } else {
        return false;
      }
    }
  });
}

function checkUsername(username) {
  //check if username exist in DB
  $.ajax({
    url: 'post.php',
    type: 'POST',
    dataType: 'json',
    data: {is_login:'true',username:username,email:readCookie('fab_chat_email')},
    success: function(exist){
      if(exist=='true') {
        return true;
      } else {
        return false;
      }
    }
  });
}

function validateEmail(email) {
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  if (!emailReg.test(email)) {
    return false;
  } else {
    return true;
  }
}

function notification(title,msg) {
  document.addEventListener('DOMContentLoaded', function () {
    if (Notification.permission !== "granted")
        Notification.requestPermission();
    });

    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.');
        return;
    }

  if (Notification.permission !== "granted")
      Notification.requestPermission();
  else {
      var notification = new Notification(title, {
        icon: window.location.pathname+'/img/paw.png',
        body: msg,
      });
  }
}

if (readCookie('fab_chat_username') === null || readCookie('fab_chat_email') === null) {
  logUser();
} else {
  hideChat(false);
}