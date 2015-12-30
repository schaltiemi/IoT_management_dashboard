'use strict';

var db = require('./db_schema.js');
var DeviceDB = db.device();

var device = {
  addDevice: function(name, uid, done) {
    var newDevice = new DeviceDB({
      name: name, uid: uid
    });
    newDevice.save(function(err, doc) {
      done(err, doc);
    });
  }, getDevice: function(devID, done) {
    DeviceDB.findOne({_id: devID}, function(err, doc) {
      done(err, doc);
    });
  }, renameDevice: function(devID, newName, done) {
    DeviceDB.findByIdAndUpdate(devID, {name: newName}, function(err, doc) {
      done(err, doc);
    });
  }, activateDevice: function(devID, done) {
    DeviceDB.findOneAndUpdate({_id: devID}, {state: true}, function(err, doc) {
      done(err, doc);
    });
  }, desactivateDevice: function(devID, done) {
    DeviceDB.findOneAndUpdate({_id: devID}, {state: false}, function(err, doc) {
      done(err, doc);
    });
  }
};

module.exports = device;
