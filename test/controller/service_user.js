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

  describe('POST /user/createGroup', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.aUser1,
        mp.preparers.aUser2,
        function () {
          agent_logged.post('/login').send({
            pseudo: cp.user1.pseudo,
            password: cp.user1.password
          }).end(function () {
            done();
          });
        }
      ]);
    });

    it('create a group', function (done) {
      agent_logged.post('/user/createGroup').send({
        groupName: cp.group1.name
      }).end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        should(res.body.msg).be.equal('ok');
        db.getUser(cp.user1.pseudo, function (err, doc) {
          should.not.exist(err);
          should(doc.groups.length).be.equal(1);
          done();
        });
      });
    });
    it('should not create group', function (done) {
      agent_not_logged.post('/user/createGroup').send({
        groupName: cp.group1.name
      }).end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(302);
        db.getUser(cp.user2.pseudo, function (err, doc) {
          should.not.exist(err);
          should(doc.groups.length).be.equal(0);
          done();
        });
      });
    });
  });
  describe('POST /user/deleteGroup', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
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

    it('should delete group', function (done) {
      agent_logged.post('/user/deleteGroup').send({
        groupID: cp.group2.id
      }).end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        db.getUser(cp.user2.pseudo, function (err, doc) {
          should.not.exist(err);
          should(doc.groups.length).be.equal(0);
          done();
        });
      });
    });
    it('should not delete group', function (done) {
      agent_not_logged.post('/user/deleteGroup').send({
        groupName: cp.group3.name
      }).end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(302);
        db.getUser(cp.user3.pseudo, function (err, doc) {
          should.not.exist(err);
          should(doc.groups.length).be.equal(1);
          done();
        });
      });
    });
  });
  describe('POST /user/addDevice', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.aUser2,
        mp.preparers.aUser3,
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

    it('should add device', function (done) {
      agent_logged.post('/user/addDevice').send({
        deviceName: cp.device2.name,
        deviceUid: cp.device2.uid
      }).end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        db.getUser(cp.user2.pseudo, function (err, doc) {
          should.not.exist(err);
          should(doc.devices.length).be.equal(1);
          done();
        });
      });
    });
    it('should not add device', function (done) {
      agent_not_logged.post('/user/addDevice').send({
        deviceName: cp.device3.name
      }).end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(302);
        db.getUser(cp.user3.pseudo, function (err, doc) {
          should.not.exist(err);
          should(doc.groups.length).be.equal(0);
          done();
        });
      });
    });
  });
  describe('POST /user/deleteDevice', function () {
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

    it('should delete device', function (done) {
      agent_logged.post('/user/removeDevice').send({
        deviceId: cp.device2.id
      }).end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        db.getUser(cp.user2.pseudo, function (err, doc) {
          should.not.exist(err);
          should(doc.devices.length).be.equal(0);
          done();
        });
      });
    });
    it('should not delete device', function (done) {
      agent_not_logged.post('/user/removeDevice').send({
        deviceId: cp.device4.id
      }).end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(302);
        db.getUser(cp.user3.pseudo, function (err, doc) {
          should.not.exist(err);
          should(doc.devices.length).be.equal(1);
          done();
        });
      });
    });
  });
  describe('POST /user/delete', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.rDeviceDB,
        mp.preparers.rGroupDB,
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

    it('should delete user', function (done) {
      agent_logged.post('/user/delete').send({
      }).end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        db.getUser(cp.user2.pseudo, function (err, doc) {
          should.not.exist(err);
          should.not.exist(doc);
          db.getDevice(cp.device2.id, function (err, doc) {
            should.not.exist(err);
            should.not.exist(doc);
            //done();
            db.getGroup(cp.group2.id, function (err, doc) {
              should.not.exist(err);
              should.not.exist(doc);
              done();
            });
          });
        });
      });
    });
    it('should not delete device', function (done) {
      agent_not_logged.post('/user/removeDevice').send({
      }).end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(302);
        db.getUser(cp.user3.pseudo, function (err, doc) {
          should.not.exist(err);
          should.exist(doc);
          should(doc.devices.length).be.equal(1);
          should(doc.groups.length).be.equal(1);
          done();
        });
      });
    });
  });
});

