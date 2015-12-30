/* global tools */
'use strict';

jQuery().ready(function() {
  jQuery('.rename-button').on('click', renameDevice);
  jQuery('.activation-button').on('switchChange.bootstrapSwitch', changeState);
  // jQuery(document).on('click', '.activation-button', changeState);
  jQuery(document).on('click', '.check', validateDeviceName);
  jQuery(document).on('click', '.cancel', cancelChange);
});

var post = function(url, data, done) {
  jQuery.ajax({
    method: 'POST', url: url, dataType: 'json', data: data, success: done, error: function(a) {
      console.log(a.tools.msg);
    }
  });
};

var deviceName = '';

var renameDevice = function() {
  var id = this.id.match(/\d+/)[0];
  console.log(id);
  deviceName = jQuery('#name-device' + id).html();
  var editableText = jQuery('<input id=new-name' + id + ' />' +
      '<button id=check-name' + id + ' class=\'btn btn-box-tool check\'><i class=\'fa fa-check\'></i></button>' +
      '<button id=cancel-name' + id + ' class=\'btn btn-box-tool cancel\'><i class=\'fa fa-times\' ' +
      'class=\'cancel\'></i></button>');
  editableText.val(deviceName);
  jQuery('#name-device' + id).html(editableText);
};

var validateDeviceName = function() {
  console.log(this.id);
  var id = this.id.match(/\d+/)[0];
  var newName = jQuery('#new-name' + id).val();
  var devID = jQuery('#delete-device-button' + id).attr('data-deviceid');
  var device = {
    deviceID: devID,
    newName: newName
  };
  jQuery('#name-device' + id).html('');
  jQuery('#name-device' + id).html(newName);
  tools.msg = 'device renamed';
  post('/device/renameDevice', device, function() {
  });
};

var cancelChange = function() {
  console.log('cancel change called');
  var id = this.id.match(/\d+/)[0];
  jQuery('#name-device' + id).html('');
  jQuery('#name-device' + id).html(deviceName);
};

var changeState = function(event, state) {
  var id = this.id.match(/\d+/)[0];
  console.log(state);
  var deviceID = jQuery('#delete-device-button' + id).attr('data-deviceid');
  var device = {
    deviceID: deviceID
  };
  if (!state) {
    console.log('desactivate device');
    tools.msg = 'device desactivated';
    post('/device/desactivate', device, tools.refreshPage);
  } else {
    console.log('activate device');
    tools.msg = 'device activated';
    post('/device/activate', device, tools.refreshPage);
  }
};
