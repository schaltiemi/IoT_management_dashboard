'use strict';

var db = require('./db_schema.js');
var GroupDB = db.group();
var DeviceDB = db.device();

var group = {
  addGroup: function(name, done) {
    var newGroup = new GroupDB({
      name: name
    });
    newGroup.save(function(err, doc) {
      done(err, doc);
    });
  }, getGroup: function(id, done) {
    GroupDB.findOne({_id: id}, function(err, doc) {
      done(err, doc);
    });
  },
  activateGroup: function(groupID, done) {
    GroupDB.findById(groupID, function(err, doc) {
      doc.devices.forEach(function(device) {
        DeviceDB.findByIdAndUpdate(device, {state: true}, function() {
        });
      });
      done(err, doc);
    });
  },
  desactivateGroup: function(groupID, done) {
    GroupDB.findById(groupID, function(err, doc) {
      doc.devices.forEach(function(device) {
        DeviceDB.findByIdAndUpdate(device, {state: false}, function() {
        });
      });
      done(err, doc);
    });
  }, renameGroup: function(groupID, newName, done) {
    GroupDB.findByIdAndUpdate(groupID, {name: newName}, function(err, doc) {
      done(err, doc);
    });
  }, addDeviceToGroup: function(groupID, devID, done) {
    GroupDB.findByIdAndUpdate(groupID, {$addToSet: {devices: devID}}, function(err, doc) {
      if (err) {
        done(err);
      } else {
        done(err, doc);
      }
    });
  }, removeDeviceFromGroup: function(groupID, devID, done) {
    GroupDB.findById(groupID, function(errGr, docGr) {
      docGr.devices.remove(devID);
      docGr.save(function() {
      });
      done(errGr, docGr);
    });
  }
};

module.exports = group;
