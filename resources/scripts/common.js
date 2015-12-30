/* exported refreshPage, tools */
'use strict';

toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: 'toast-bottom-center',
  preventDuplicates: false,
  onclick: null,
  showDuration: '300',
  hideDuration: '1000',
  timeOut: '5000',
  extendedTimeOut: '1000',
  showEasing: 'swing',
  hideEasing: 'linear',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut'
};

jQuery().ready(function() {
  jQuery('#login_button').on('click', tryLogin);
  jQuery('#register-button').on('click', tryRegister);
  jQuery('#logout-button').on('click', logout);
});


// BEGIN COMMON TOOLS
var tools = {};
tools.msg = '';

tools.post = function(url, data, done, failFunction) {
  jQuery.ajax({
    method: 'POST', url: url, dataType: 'json', data: data, success: done, error: failFunction
  });
};

tools.refreshPage = function() {
  toastr.success(tools.msg, 'Ok');
  setTimeout(function() {
    location.reload();
  }, 1000);
};

tools.redirectHome = function() {
  toastr.success(tools.msg, 'Ok');
  setTimeout(function() {
    jQuery(location).attr('href', '/home');
  }, 1000);
};
// END COMMON TOOLS

var tryLogin = function() {
  var pseudo = jQuery('#login-pseudo').val();
  var password = jQuery('#login-password').val();
  var user = {
    pseudo: pseudo, password: password
  };
  tools.msg = 'login succeed';
  tools.post('/login', user, tools.redirectHome, failLogin);
};

var failLogin = function() {
  console.log('fail login');
  toastr.error('Wrong password or login', 'Error');
};

var tryRegister = function() {
  var pseudo = jQuery('#register-pseudo').val();
  var password1 = jQuery('#register-password1').val();
  var password2 = jQuery('#register-password2').val();
  if (password1 !== password2) {
    toastr.error('Passwords should be the same', 'Error');
  } else if (!pseudo || !password1 || !password2) {
    toastr.error('Fields should not be empty', 'Error');
  } else {
    var user = {
      pseudo: pseudo, password: password1
    };
    tools.msg = 'register succeed';
    tools.post('/register', user, redirectLogin, failRegister);
  }
};

var failRegister = function() {
  toastr.error('Login already exists', 'Error');
};

var logout = function() {
  tools.msg = 'log out user';
  tools.post('/logout', {}, tools.redirectHome, tools.redirectHome);
};

var redirectLogin = function(a) {
  if (a.msg === 'pseudo already exists') {
    toastr.error('Login already exists', 'Error');
  } else {
    toastr.success('Register succeed', 'Ok');
    setTimeout(function() {
      jQuery(location).attr('href', '/login');
    }, 1000);
  }
};
