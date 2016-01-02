'use strict';

//RAJOUTER AUSSI DES TEST PAS SENSé MARCHER. ADD DEVICE 1 TO GROUP 3/56 par exemple

var db = require('../../app/model/db_interface.js');
var dbSchema = require('../../app/model/db_schema.js');

var mp = {
  preparers: {
    chainPreparers: function(nextArray) {
      var next = nextArray.splice(0, 1)[0];
      next(nextArray);
    },
    rUserDB: function(nextArray) {
      var userDB = dbSchema.user();
      userDB.remove({}, function() {
        var next = nextArray.splice(0, 1)[0];
        next(nextArray);
      });
    },
    rGroupDB: function(nextArray) {
      var groupDB = dbSchema.group();
      groupDB.remove({}, function() {
        var next = nextArray.splice(0, 1)[0];
        next(nextArray);
      });
    },
    rDeviceDB: function(nextArray) {
      var deviceDB = dbSchema.device();
      deviceDB.remove({}, function() {
        var next = nextArray.splice(0, 1)[0];
        next(nextArray);
      });
    },
    aUser1: function(nextArray) {
      db.addUser(mp.user1.pseudo, mp.user1.password, function(err, doc) {
        mp.user1.id = doc._id;
        var next = nextArray.splice(0, 1)[0];
        next(nextArray);
      });
    },
    aUser2: function(nextArray) {
      db.addUser(mp.user2.pseudo, mp.user2.password, function(err, doc) {
        mp.user2.id = doc._id;
        var next = nextArray.splice(0, 1)[0];
        next(nextArray);
      });
    },
    aUser3: function(nextArray) {
      db.addUser(mp.user3.pseudo, mp.user3.password, function() {
        var next = nextArray.splice(0, 1)[0];
        next(nextArray);
      });
    },
    aGroup1: function(nextArray) {
      db.getUser(mp.user2.pseudo, function() {
        db.addGroupToUser(mp.user2.pseudo,mp.group1.name, function(err_g, doc_g) {
          mp.group1.id=doc_g.id;
          var next = nextArray.splice(0, 1)[0];
          next(nextArray);
        });
      });
    },
    aGroup2: function(nextArray) {
      db.getUser(mp.user2.pseudo, function() {
        db.addGroupToUser(mp.user2.pseudo,mp.group2.name, function(err_g, doc_g) {
          mp.group2.id=doc_g._id;
          var next = nextArray.splice(0, 1)[0];
          next(nextArray);
        });
      });
    },
    aGroup3: function(nextArray) {
      db.getUser(mp.user3.pseudo, function() {
        db.addGroupToUser(mp.user3.pseudo,mp.group3.name, function(err_g, doc_g) {
          mp.group3.id=doc_g.id;
          var next = nextArray.splice(0, 1)[0];
          next(nextArray);
        });
      });
    },
    aDevice1: function(nextArray) {
      db.getUser(mp.user2.pseudo, function() {
        db.addDeviceToUser(mp.user2.pseudo,mp.device1.name,mp.device1.uid, function(err, doc) {
          mp.device1.id=doc.id;
          var next = nextArray.splice(0, 1)[0];
          next(nextArray);
        });
      });
    },
    aDevice2: function(nextArray) {
      db.getUser(mp.user2.pseudo, function() {
        db.addDeviceToUser(mp.user2.pseudo,mp.device2.name,mp.device2.uid, function(err, doc) {
          mp.device2.id=doc._id;
          var next = nextArray.splice(0, 1)[0];
          next(nextArray);

        });
      });
    },
    aDevice4: function(nextArray) {
      db.getUser(mp.user3.pseudo, function() {
        db.addDeviceToUser(mp.user3.pseudo,mp.device4.name,mp.device4.uid, function(err, doc) {
          mp.device4.id=doc.id;
          var next = nextArray.splice(0, 1)[0];
          next(nextArray);
        });
      });
    },
    aDevice1ToGroup2: function(nextArray) {
      db.addDeviceToGroup(mp.group2.id, mp.device1.id, function(){
        var next = nextArray.splice(0, 1)[0];
        next(nextArray);
      });
    },
    aDevice2ToGroup1: function(nextArray) {
      db.addDeviceToGroup(mp.group1.id, mp.device2.id, function(){
        var next = nextArray.splice(0, 1)[0];
        next(nextArray);
      });
    },
    aDevice2ToGroup2: function(nextArray) {
      console.log('pik');
      db.addDeviceToGroup(mp.group2.id, mp.device2.id, function(){
        console.log('pok');
        var next = nextArray.splice(0, 1)[0];
        next(nextArray);
      });
    },
    aDevice4ToGroup3: function(nextArray) {
      db.addDeviceToGroup(mp.group3.id, mp.device4.id, function(){
        var next = nextArray.splice(0, 1)[0];
        next(nextArray);
      });
    },
    activateDevice1: function(nextArray){
      console.log("call activate device 1");
      db.activateDevice(mp.device1.id, function(){
        console.log('activation ok');
        var next = nextArray.splice(0, 1)[0];
        next(nextArray);
      });
    },
    activateDevice2: function(nextArray){
      db.activateDevice(mp.device2.id, function(){
        var next = nextArray.splice(0, 1)[0];
        next(nextArray);
      });
    },
    activateDevice4: function(nextArray){
      db.activateDevice(mp.device4.id, function(){
        var next = nextArray.splice(0, 1)[0];
        next(nextArray);
      });
    },
    activateGroup2: function(nextArray){
      db.activateGroup(mp.group2.id, function(){
        var next = nextArray.splice(0, 1)[0];
        next(nextArray);
      });
    },
    activateGroup3: function(nextArray){
      db.activateGroup(mp.group3.id, function(){
        var next = nextArray.splice(0, 1)[0];
        next(nextArray);
      });
    }
  }
};

require('../config/preparer')(mp);

module.exports = mp;