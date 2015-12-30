'use strict';


var should = require('should');
require('should-http');
var supertest = require('supertest');
var cp = require('./controller_preparer');
var mp = require('../model/model_preparer');
var db = require('../../app/model/db_interface');

var agent_logged = supertest.agent(require('../../app/controller/express_server.js'));
var agent_not_logged = supertest.agent(require('../../app/controller/express_server.js'));

describe('Routing user services', function () {
  after(function (done) {
    mp.preparers.chainPreparers([
      mp.preparers.rUserDB,
      mp.preparers.rGroupDB,
      mp.preparers.rDeviceDB, function () {
        done();
      }]);
  });

  describe('POST /device/renameDevice', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.rDeviceDB,
        mp.preparers.aUser2,
        mp.preparers.aUser3,
        mp.preparers.aDevice2,
        mp.preparers.aDevice4,
        function () {
          agent_logged.post('/login').send({
            pseudo: cp.user2.pseudo,
            password: cp.user2.password
          }).end(function () {
            done();
          });
        }
      ]);
    });

    it('rename device', function (done) {
      agent_logged.post('/device/renameDevice').send({
        deviceID: cp.device2.id, newName: "licorne"
      }).end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        should(res.body.msg).be.equal('ok');
        db.getDevice(cp.device2.id, function (err, doc) {
          should.not.exist(err);
          should(doc.name).not.be.equal(cp.device2.name);
          done();
        });
      });
    });
    it('should not rename device', function (done) {
      agent_not_logged.post('/device/renameDevice').send({
        deviceID: cp.device4.id, newName: "licorne"
      }).end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(302);
        db.getDevice(cp.device4.id, function (err, doc) {
          should.not.exist(err);
          should(doc.name).be.equal(cp.device4.name);
          done();
        });
      });
    });
  });
  describe('POST /device/activateDevice', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.rDeviceDB,
        mp.preparers.aUser2,
        mp.preparers.aUser3,
        mp.preparers.aDevice2,
        mp.preparers.aDevice4,
        function () {
          agent_logged.post('/login').send({
            pseudo: cp.user2.pseudo,
            password: cp.user2.password
          }).end(function () {
            done();
          });
        }
      ]);
    });

    it('activate device', function (done) {
      agent_logged.post('/device/activate').send({
        deviceID: cp.device2.id
      }).end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        should(res.body.msg).be.equal('ok');
        db.getDevice(cp.device2.id, function (err, doc) {
          should.not.exist(err);
          should(doc.state).be.equal(true);
          done();
        });
      });
    });
    it('should not activate device', function (done) {
      agent_not_logged.post('/device/activate').send({
        deviceID: cp.device4.id
      }).end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(302);
        db.getDevice(cp.device4.id, function (err, doc) {
          should.not.exist(err);
          should(doc.state).be.equal(false);
          done();
        });
      });
    });
  });
  describe('POST /device/desactivateDevice', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.rDeviceDB,
        mp.preparers.aUser2,
        mp.preparers.aUser3,
        mp.preparers.aDevice2,
        mp.preparers.aDevice4,
        mp.preparers.activateDevice2,
        mp.preparers.activateDevice4,
        function () {
          agent_logged.post('/login').send({
            pseudo: cp.user2.pseudo,
            password: cp.user2.password
          }).end(function () {
            done();
          });
        }
      ]);
    });

    it('desactivate device', function (done) {
      agent_logged.post('/device/desactivate').send({
        deviceID: cp.device2.id
      }).end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        should(res.body.msg).be.equal('ok');
        db.getDevice(cp.device2.id, function (err, doc) {
          should.not.exist(err);
          should(doc.state).be.equal(false);
          done();
        });
      });
    });
    it('should not desactivate device', function (done) {
      agent_not_logged.post('/device/desactivate').send({
        deviceID: cp.device4.id
      }).end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(302);
        db.getDevice(cp.device4.id, function (err, doc) {
          should.not.exist(err);
          should(doc.state).be.equal(true);
          done();
        });
      });
    });
  });
});


