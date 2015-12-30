'use strict';

var dbUser = require('./user.js');
var dbGroup = require('./group.js');
var dbDevice = require('./device.js');

var db = {
  addUser: dbUser.addUser,
  removeUser: dbUser.removeUser,
  removeDevice: dbUser.removeDevice,
  removeGroup: dbUser.removeGroup,
  addDeviceToUser: dbUser.addDeviceToUser,
  addGroupToUser: dbUser.addGroupToUser,
  getUser: dbUser.getUser,
  activateUser: dbUser.activateUser,
  desactivateUser: dbUser.desactivateUser,
  addGroup: dbGroup.addGroup,
  renameGroup: dbGroup.renameGroup,
  addDeviceToGroup: dbGroup.addDeviceToGroup,
  removeDeviceFromGroup: dbGroup.removeDeviceFromGroup,
  getGroup: dbGroup.getGroup,
  addDevice: dbDevice.addDevice,
  renameDevice: dbDevice.renameDevice,
  getDevice: dbDevice.getDevice,
  activateDevice: dbDevice.activateDevice,
  desactivateDevice: dbDevice.desactivateDevice,
  activateGroup: dbGroup.activateGroup,
  desactivateGroup: dbGroup.desactivateGroup,
  isDeviceOwner: dbUser.isDeviceOwner,
  isGroupOwner: dbUser.isGroupOwner,
  getUserById: dbUser.getUserById,
  getFullUserById: dbUser.getFullUserById
};

module.exports = db;