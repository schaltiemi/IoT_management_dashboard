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

  describe('POST /group/renameGroup', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.rGroupDB,
        mp.preparers.aUser2,
        mp.preparers.aUser3,
        mp.preparers.aGroup2,
        mp.preparers.aGroup3,
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

    it('rename group', function (done) {
      agent_logged.post('/group/renameGroup').send({
        groupID: cp.group2.id, newName: "licorne"
      }).end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        should(res.body.msg).be.equal('ok');
        db.getGroup(cp.group2.id, function (err, doc) {
          should.not.exist(err);
          should(doc.name).not.be.equal(cp.group2.name);
          done();
        });
      });
    });
    it('should not rename group', function (done) {
      agent_not_logged.post('/group/renameGroup').send({
        groupID: cp.group3.id, newName: "licorne"
      }).end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(302);
        db.getGroup(cp.group3.id, function (err, doc) {
          should.not.exist(err);
          should(doc.name).be.equal(cp.group3.name);
          done();
        });
      });
    });
  });
  describe('POST /group/activateGroup', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.rGroupDB,
        mp.preparers.aUser2,
        mp.preparers.aUser3,
        mp.preparers.aGroup2,
        mp.preparers.aGroup3,
        mp.preparers.aDevice2,
        mp.preparers.aDevice4,
        mp.preparers.aDevice2ToGroup2,
        mp.preparers.aDevice4ToGroup3,
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

    it('activate group', function (done) {
      agent_logged.post('/group/activate').send({
        groupID: cp.group2.id
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
    it('should not activate group', function (done) {
      agent_not_logged.post('/group/activate').send({
        groupID: cp.group3.id
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
  describe('POST /device/desactivateGroup', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.rGroupDB,
        mp.preparers.rDeviceDB,
        mp.preparers.aUser2,
        mp.preparers.aUser3,
        mp.preparers.aGroup2,
        mp.preparers.aGroup3,
        mp.preparers.aDevice2,
        mp.preparers.aDevice4,
        mp.preparers.aDevice2ToGroup2,
        mp.preparers.aDevice4ToGroup3,
        mp.preparers.activateGroup2,
        mp.preparers.activateGroup3,
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

    it('desactivate group', function (done) {
      agent_logged.post('/group/desactivate').send({
        groupID: cp.group2.id
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
    it('should not desactivate group', function (done) {
      agent_not_logged.post('/group/desactivate').send({
        groupID: cp.group3.id
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
  describe('POST /group/addDeviceToGroup', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.rGroupDB,
        mp.preparers.rDeviceDB,
        mp.preparers.aUser2,
        mp.preparers.aUser3,
        mp.preparers.aGroup2,
        mp.preparers.aGroup3,
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
    it('add device to group', function (done) {
      agent_logged.post('/group/addDeviceToGroup').send({
        groupID: cp.group2.id, deviceID: cp.device2.id
      }).end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        should(res.body.msg).be.equal('ok');
        db.getGroup(cp.group2.id, function (err, doc) {
          should.not.exist(err);
          should(doc.devices.length).be.equal(1);
          done();
        });
      });
    });
    it('should not add device to group', function (done) {
      agent_not_logged.post('/group/addDeviceToGroup').send({
        groupID: cp.group3.id, deviceID: cp.device4.id
      }).end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(302);
        db.getGroup(cp.group3.id, function (err, doc) {
          should.not.exist(err);
          should(doc.devices.length).be.equal(0);
          done();
        });
      });
    });
  });
});



