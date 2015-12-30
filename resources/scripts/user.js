/* global tools */
'use strict';

var guid = function() {
  function _p8(s) {
    var p = (Math.random().toString(8) + '000000000').substr(2, 8);
    return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
  }

  return _p8();
};

jQuery().ready(function() {
  jQuery('#button-uid').on('click', getUid);
  jQuery('#add-device').on('click', addDevice);
  jQuery('.delete-device').on('click', deleteDevice);
  jQuery('#add-group').on('click', addGroup);
  jQuery('#remove-group-button').on('click', deleteGroup);
  jQuery('#remove-user').on('click', removeUser);
});

var post = function(url, data, done) {
  jQuery.ajax({
    method: 'POST', url: url, dataType: 'json', data: data, success: done, error: function(a) {
      console.log(a.tools.msg);
    }
  });
};

var getUid = function() {
  console.log('uid button pressed');
  jQuery('#input-uid').val(guid() + '');
};



var addDevice = function() {
  console.log('add device button');
  var name = jQuery('#new-device-name').val();
  var uid = jQuery('#input-uid').val();
  var device = {
    deviceName: name, deviceUid: uid
  };
  if (!name || !uid) {
    toastr.error('Fields should not be empty', 'Error');
  } else {
    console.log('before post');
    tools.msg = 'device added';
    post('/user/addDevice', device, tools.refreshPage);
  }
};

var deleteGroup = function() {
  var groupID = jQuery('#remove-group-button').attr('data-groupid');
  var group = {
    groupID: groupID
  };
  tools.msg = 'group deleted';
  post('/user/deleteGroup', group, tools.redirectHome);
};

var deleteDevice = function() {
  var id = this.id.match(/\d+/)[0];
  var devID = jQuery('#delete-device-button' + id).attr('data-deviceid');
  var device = {
    deviceId: devID
  };
  tools.msg = 'device deleted';
  post('/user/removeDevice', device, tools.refreshPage);
};

var addGroup = function() {
  var name = jQuery('#new-group-name').val();
  var group = {
    groupName: name
  };
  if (!name) {
    toastr.error('Fields should not be empty', 'Error');
  } else {
    tools.msg = 'group added';
    post('/user/createGroup', group, tools.refreshPage);
  }
};

var removeUser = function() {
  console.log('delete func calld');
  tools.msg = 'user deleted';
  post('/user/delete', {}, tools.redirectHome);
};
