/* global tools */
'use strict';

jQuery().ready(function() {
  jQuery('#add-device-group').on('click', addDeviceToGroup);
  jQuery('#rename-button-group').on('click', renameGroup);
  jQuery('.delete-device-group').on('click', deleteDeviceGroup);
  jQuery(document).on('click', '#check-name-group', validateGroupName);
  jQuery(document).on('click', '#cancel-name-group', cancelGroupName);
  jQuery('#activation-button-group').on('switchChange.bootstrapSwitch', changeGroupState);
});

var post = function(url, data, done) {
  jQuery.ajax({
    method: 'POST', url: url, dataType: 'json', data: data, success: done
  });
};

var groupName = '';

var renameGroup = function() {
  groupName = jQuery('#name-group').html();
  var editableText = jQuery('<input id=newW-group-name />' +
      '<button id=check-name-group' + '' + ' class=\'btn btn-box-tool\'><i class=\'fa fa-check\'></i></button>' +
      '<button id=cancel-name-group' + '' + ' class=\'btn btn-box-tool\'><i class=\'fa fa-times\' ' +
      '></i></button>');
  editableText.val(groupName);
  jQuery('#name-group' + '').html(editableText);
};


var addDeviceToGroup = function() {
  var deviceID = jQuery('#choose-device').find(':selected').attr('data-deviceid');
  var groupID = jQuery('#group-description').attr('data-groupid');
  var info = {
    groupID: groupID, deviceID: deviceID
  };
  tools.msg = 'device added to group';
  post('/group/addDeviceToGroup', info, tools.refreshPage);
};


var validateGroupName = function() {
  var newName = jQuery('#newW-group-name').val();
  var groupID = jQuery('#remove-group-button').attr('data-groupid');
  console.log(groupID);
  var group = {
    groupID: groupID,
    newName: newName
  };
  jQuery('#name-group').html('');
  jQuery('#name-group').html(newName);
  tools.msg = 'group renamed';
  post('/group/renameGroup', group, tools.refreshPage);
};

var cancelGroupName = function() {
  jQuery('#name-group').html('');
  jQuery('#name-group').html(groupName);
};

var deleteDeviceGroup = function() {
  console.log('delete device group called');
  var id = this.id.match(/\d+/)[0];
  var devID = jQuery('#delete-device-group' + id).attr('data-deviceid');
  var groupID = jQuery('#remove-group-button').attr('data-groupid');
  var deviceGroup = {
    deviceID: devID,
    groupID: groupID
  };
  tools.msg = 'device deleted';
  post('/group/removeDeviceFromGroup', deviceGroup, tools.refreshPage);
};

var changeGroupState = function(event, state) {
  var groupID = jQuery('#remove-group-button').attr('data-groupid');
  var group = {
    groupID: groupID
  };
  if (!state) {
    console.log('desactivate group');
    tools.msg = 'group desactivated';
    post('/group/desactivate', group, tools.refreshPage);
  } else {
    console.log('activate activate group');
    tools.msg = 'group activated';
    post('/group/activate', group, tools.refreshPage);
  }
};

