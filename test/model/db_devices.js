'use strict';
/* globals describe, it, before, after */

var should = require('should');
var uid = require('uid');
var expect = require('expect.js');
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

  describe('#addDevice()', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rDeviceDB,
        function () {
          done();
        }
      ]);
    });

    it('Add a device', function (done) {
      db.addDevice(mp.device1.name, uid(), function (e) {
        should.not.exist(e);
        done()
      });
    });
  });

  describe('#getDevice()', function() {
    before(function(done) {
      mp.preparers.chainPreparers([
        mp.preparers.rDeviceDB,
        mp.preparers.aUser2,
        mp.preparers.aDevice1,
        function() {
          done();
        }
      ]);
    });

    it('retrieves group 1', function(done) {
      db.getDevice(mp.device1.id, function(err, doc) {
        should.not.exist(err);
        should(doc.name).be.equal(mp.device1.name);
        done();
      });
    });

    it('should not retrieve group id 1234', function(done) {
      db.getDevice(1234, function(err, doc) {
        should(err.message).be.equal("Cast to ObjectId failed for value \"1234\" at path \"_id\"");
        should.not.exist(doc);
        done();
      });
    });
  });
  describe('#renameDevice()', function() {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rDeviceDB,
        mp.preparers.rUserDB,
        mp.preparers.aUser2,
        mp.preparers.aDevice1,
        function () {
          done();
        }
      ]);
    });

    it('rename device 1', function (done) {
      db.renameDevice(mp.device1.id, 'maison', function (err, doc) {
        should.not.exist(err);
        db.getDevice(doc.id, function(err2, doc2){
          should(doc2.name).not.be.equal(mp.device1.name);
          done();
        });
      });
    });
  });
  describe('#activateDevice()', function() {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rDeviceDB,
        mp.preparers.rUserDB,
        mp.preparers.aUser2,
        mp.preparers.aDevice1,
        function () {
          done();
        }
      ]);
    });

    it('activate device 1', function (done) {
      db.activateDevice(mp.device1.id, function(err,doc){
        should.not.exist(err);
        db.getDevice(doc.id, function(err2, doc2){
          should(doc2.state).be.equal(true);
          done();
        });
      });
    });
  });
  describe  ('#desactivateDevice()', function() {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rDeviceDB,
        mp.preparers.rUserDB,
        mp.preparers.aUser2,
        mp.preparers.aDevice1,
        mp.preparers.activateDevice1,
        function () {
          console.log("end of chain");
          done();
        }
      ]);
    });

    it('desactivate device 1', function (done) {
      db.desactivateDevice(mp.device1.id, function(err,doc){
        console.log(doc);
        should.not.exist(err);
        db.getDevice(doc.id, function(err2, doc2){
          should(doc2.state).be.equal(false);
          done();
        });
      });
    });
  });
});

