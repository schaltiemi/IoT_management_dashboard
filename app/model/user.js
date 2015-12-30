'use strict';

var db = require('./db_schema.js');
var deviceF = require('./device.js');
var groupF = require('./group.js');
var UserDB = db.user();
var DeviceDB = db.device();
var GroupDB = db.group();

var user = {
  addUser: function(pseudo, password, done) {
    var newUser = new UserDB({
      pseudo: pseudo, password: password
    });
    newUser.save(function(err, doc) {
      done(err, doc);
    });
  },

  removeGroup: function(pseudo, groupID, done) {
    UserDB.findOne({pseudo: pseudo}, function(errUs, docUs) {
      GroupDB.findOneAndRemove({_id: groupID}, function(errGroup, docGroup) {
        docUs.groups.remove(docGroup.id);
        docUs.save(function(err, doc) {
          done(err, doc);
        });
      });
    });
  },

  removeDevice: function(pseudo, deviceID, done) {
    UserDB.findOne({pseudo: pseudo}, function(errUs, docUs) {
      DeviceDB.findOneAndRemove({_id: deviceID}, function(errDev, docDev) {
        GroupDB.find({devices: docDev._id}, function(errGroup, docGroup) {
          docGroup.forEach(function(gr) {
            groupF.removeDeviceFromGroup(gr.id, docDev.id, function() {
            });
          });
        });
        docUs.devices.remove(docDev.id);
        docUs.save(function(err, doc) {
          done(err, doc);
        });
      });
    });
  },

  removeUser: function(pseudo, done) {
    UserDB.findOneAndRemove({pseudo: pseudo}, function(err, doc) {
      doc.devices.forEach(function(device) {
        DeviceDB.remove({_id: device}, function(err) {
          if (err) {
            console.log(err);
          }
        });
      });
      doc.groups.forEach(function(group) {
        GroupDB.remove({_id: group}, function(err) {
          if (err) {
            console.log(err);
          }
        });
      });
      done(err, doc);
    });
  },

  getUser: function(pseudo, done) {
    UserDB.findOne({pseudo: pseudo}, function(err, doc) {
      done(err, doc);
    });
  },

  getUserById: function(userId, done) {
    UserDB.findById(userId, function(err, doc) {
      done(err, doc);
    });
  },

  getFullUserById: function(id, done) {
    UserDB.findById(id).populate('devices groups').exec(function(err, doc) {
      GroupDB.populate(doc, {path: 'groups.devices', model: DeviceDB}, function() {
        done(err, doc);
      });
      // done(err, doc);
    });
  },

  addDeviceToUser: function(pseudo, deviceName, deviceUid, done) {
    deviceF.addDevice(deviceName, deviceUid, function(errDevice, docDevice) {
      UserDB.find({pseudo: pseudo}, function(errUs, docUs) {
        UserDB.findByIdAndUpdate(docUs[0].id, {$addToSet: {devices: docDevice.id}}, function(err) {
          if (err) {
            console.log(err);
          } else {
            done(errDevice, docDevice);
          }
        });
      });
    });
  },

  addGroupToUser: function(pseudo, groupName, done) {
    groupF.addGroup(groupName, function(errGroup, docGroup) {
      UserDB.find({pseudo: pseudo}, function(err, docUs) {
        UserDB.findByIdAndUpdate(docUs[0].id, {$addToSet: {groups: docGroup.id}}, function(err) {
          if (err) {
            console.log(err);
          } else {
            done(errGroup, docGroup);
          }
        });
      });
    });
  },

  activateUser: function(pseudo, done) {
    UserDB.findOneAndUpdate({pseudo: pseudo}, {active: true}, function(err, doc) {
      done(err, doc);
    });
  },

  desactivateUser: function(pseudo, done) {
    UserDB.findOneAndUpdate({pseudo: pseudo}, {active: false}, function(err, doc) {
      done(err, doc);
    });
  },

  isDeviceOwner: function(userId, deviceId, done) {
    UserDB.findById(userId, function(err, doc) {
      done(doc.devices.indexOf(deviceId) > -1);
    });
  },

  isGroupOwner: function(userId, groupId, done) {
    UserDB.findById(userId, function(err, doc) {
      done(doc.groups.indexOf(groupId) > -1);
    });
  }
};

module.exports = user;

/*deviceF.addDevice('lampe','eajhjk3', function(){
 //console.log(doc.name);
 });*/

