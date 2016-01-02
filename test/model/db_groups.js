'use strict';
/* globals describe, it, before, after */

var should = require('should');
var mp = require('./model_preparer.js');
var db = require('../../app/model/db_interface.js');

describe('DB Groups', function () {
  after(function (done) {
    mp.preparers.chainPreparers([
      mp.preparers.rDeviceDB,
      mp.preparers.rGroupDB,
      mp.preparers.rUserDB,
      function () {
        done();
      }
    ]);
  });

  describe('#addGroup()', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rGroupDB,
        function () {
          done();
        }
      ]);
    });

    it('Add a group', function (done) {
      db.addGroup(mp.group1.name, function (e) {
        should.not.exist(e);
        done()
      });
    });
  });

  describe('#getGroup()', function() {
    before(function(done) {
      mp.preparers.chainPreparers([
        mp.preparers.rGroupDB,
        mp.preparers.aUser2,
        mp.preparers.aGroup1,
        function() {
          done();
        }
      ]);
    });

    it('retrieves group 1', function(done) {
      db.getGroup(mp.group1.id, function(err, doc) {
        should.not.exist(err);
        should(doc.name).be.equal(mp.group1.name);
        done();
      });
    });

    it('should not retrieve group id 1234', function(done) {
      db.getGroup(1234, function(err, doc) {
        console.log(err.message);
        should(err.message).be.equal("Cast to ObjectId failed for value \"1234\" at path \"_id\"");
        should.not.exist(doc);
        done();
      });
    });
  });
  describe('#renameGroup()', function() {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rGroupDB,
        mp.preparers.rUserDB,
        mp.preparers.aUser2,
        mp.preparers.aGroup1,
        function () {
          done();
        }
      ]);
    });

    it('rename group 1', function (done) {
      db.renameGroup(mp.group1.id, 'maison', function (err, doc) {
        should.not.exist(err);
        db.getGroup(doc.id, function(err2, doc2){
          should(doc2.name).not.be.equal(mp.group1.name);
          done();
        });
      });
    });
  });
  describe('#addDeviceToGroup()', function() {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rGroupDB,
        mp.preparers.rUserDB,
        mp.preparers.rDeviceDB,
        mp.preparers.aUser2,
        mp.preparers.aGroup1,
        mp.preparers.aDevice2,
        function () {
          done();
        }
      ]);
    });

    it('add device to group', function (done) {
      db.addDeviceToGroup(mp.group1.id, mp.device2.id, function (err, doc) {
        should.not.exist(err);
        db.getGroup(doc._id, function(err2, doc2){
          db.getDevice(doc2.devices[0], function(err3,doc3){
            should(doc3._id+"").be.equal(mp.device2.id+"");
            done();
          });
        });
      });
    });
  });
  describe('#removeDeviceToGroup()', function() {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rGroupDB,
        mp.preparers.rUserDB,
        mp.preparers.rDeviceDB,
        mp.preparers.aUser2,
        mp.preparers.aGroup1,
        mp.preparers.aDevice2,
        mp.preparers.aDevice2ToGroup1,
        function () {
          done();
        }
      ]);
    });

    it('remove device from group', function (done) {
      db.removeDeviceFromGroup(mp.group1.id, mp.device2.id, function (err, doc) {
        should.not.exist(err);
        db.getGroup(doc._id, function(err2, doc2){
          should(doc2.devices.length).be.equal(0);
          done();
        });
      });
    });
  });
  describe('#activateGroup()', function() {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rDeviceDB,
        mp.preparers.rUserDB,
        mp.preparers.aUser2,
        mp.preparers.aGroup2,
        mp.preparers.aDevice1,
        mp.preparers.aDevice1ToGroup2,
        function () {
          done();
        }
      ]);
    });

    it('activate group 2', function (done) {
      db.activateGroup(mp.group2.id, function(err){
        should.not.exist(err);
        db.getDevice(mp.device1.id, function(err2, doc2){
          should(doc2.state).be.equal(true);
          done();
        });
      });
    });
  });
  describe('#desactivateGroup()', function() {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rDeviceDB,
        mp.preparers.rUserDB,
        mp.preparers.rGroupDB,
        mp.preparers.aUser2,
        mp.preparers.aDevice1,
        mp.preparers.aGroup2,
        mp.preparers.aDevice1ToGroup2,
        mp.preparers.activateDevice1,
        function () {
          console.log("end of chain");
          done();
        }
      ]);
    });

    it('desactivate group2', function (done) {
      db.desactivateGroup(mp.group2.id, function(err,doc){
        console.log(doc);
        should.not.exist(err);
        db.getDevice(mp.device1.id, function(err2, doc2){
          should(doc2.state).be.equal(false);
          done();
        });
      });
    });
  });
});

