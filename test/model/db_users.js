'use strict';
/* globals describe, it, before, after */

//mocha --recursive
//npm test

var should = require('should');
var expect = require('expect.js');
var mp = require('./model_preparer.js');
var db = require('../../app/model/db_interface.js');

describe('DB Users', function () {
  after(function (done) {
    mp.preparers.chainPreparers([
      mp.preparers.rUserDB,
      function () {
        done();
      }
    ]);
  });

  describe('#addUser()', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        function () {
          done();
        }
      ]);
    });

    it('Add a user', function (done) {
      db.addUser(mp.user1.pseudo, mp.user1.password, function (e) {
        should.not.exist(e);
        db.getUser(mp.user1.pseudo, function (err, doc) {
          should.not.exist(err);
          should(doc.pseudo).be.equal(mp.user1.pseudo);
          done();
        });
      });
    });

    it('can\'t add user : same user', function (done) {
      db.addUser(mp.user1.pseudo, mp.user1.password, function (err) {
        should(err.code).be.equal(11000);
        expect(err.message).to.contain('dup key:');
        done();
      });
    });

    it('can\'t add user : email is empty', function (done) {
      db.addUser(null, mp.user2.password, function (err) {
        should(err.toString()).be.equal('ValidationError: Path `pseudo` is required.');
        done();
      });
    });

    it('can\'t add user : password is empty', function (done) {
      db.addUser(mp.user2.pseudo, null, function (err) {
        should(err.toString()).be.equal('ValidationError: Path `password` is required.');
        done();
      });
    });
  });

  describe('#getUser()', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.aUser1,
        function () {
          done();
        }
      ]);
    });

    it('retrieves user : charlie', function (done) {
      db.getUser(mp.user1.pseudo, function (err, doc) {
        should.not.exist(err);
        console.log(doc);
        should(doc.pseudo).be.equal(mp.user1.pseudo);
        should(doc.password).be.equal(mp.user1.password);
        done();
      });
    });

    it('should not retrieve user', function (done) {
      db.getUser('alabama', function (err, doc) {
        should.not.exist(err);
        should.not.exist(doc);
        done();
      });
    });
  });

  describe('#activateUser()', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.aUser1,
        function () {
          db.desactivateUser(mp.user1.pseudo, function () {
            done();
          });
        }
      ]);
    });


    it('activate user', function (done) {
      db.activateUser(mp.user1.pseudo, function (err1) {
        should.not.exist(err1);
        db.getUser(mp.user1.pseudo, function (err2, doc2) {
          should.not.exist(err2);
          should(doc2.active).be.equal(true);
          done();
        });
      });
    });
  });

  describe('#desactivateUser()', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.aUser1,
        function () {
          done();
        }
      ]);
    });

    it('desactivate user', function (done) {
      db.desactivateUser(mp.user1.pseudo, function (err1) {
        should.not.exist(err1);
        db.getUser(mp.user1.pseudo, function (err2, doc2) {
          should.not.exist(err2);
          should(doc2.active).be.equal(false);
        });
        done();
      });
    });
  });

  describe('#addDeviceToUser()', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.aUser1,
        function () {
          done();
        }
      ]);
    });

    it('add device to user', function (done) {
      db.addDeviceToUser(mp.user1.pseudo, mp.device1.name, mp.device1.uid, function (e, d) {
        should.not.exist(e);
        console.log(d.id);
        db.getDevice(d.id, function (err, doc) {
          console.log(doc);
          //console.log("device id"+ mp.device1.id);
          should.not.exist(err);
          should(doc.name).be.equal(mp.device1.name);
          done();
        });
      });
    });

  });

  describe('#addGroupToUser()', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.rDeviceDB,
        mp.preparers.aUser1,
        function () {
          done();
        }
      ]);
    });

    it('add group to user', function (done) {
      db.addGroupToUser(mp.user1.pseudo, mp.group1.name, function (e, d) {
        should.not.exist(e);
        console.log(d.id);
        db.getGroup(d.id, function (err, doc) {
          console.log(doc);
          //console.log("device id"+ mp.device1.id);
          should.not.exist(err);
          should(doc.name).be.equal(mp.group1.name);
          done()
        });
      });
    });

  });
  describe('#removeGroup()', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.rGroupDB,
        mp.preparers.rDeviceDB,
        mp.preparers.aUser2,
        mp.preparers.aDevice2,
        mp.preparers.aGroup2,
        mp.preparers.aDevice2ToGroup2,
        function () {
          done();
        }
      ]);
    });

    it('remove group from user', function (done) {
      db.removeGroup(mp.user2.pseudo, mp.group2.id, function (e, d) {
        should.not.exist(e);
        console.log(d);
        should(d.groups.length).be.equal(0);
        db.getUser(mp.user2.name, function () {
          done();
        });
      });
    });
  });
  describe('#removeDevice()', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.rGroupDB,
        mp.preparers.rDeviceDB,
        mp.preparers.aUser2,
        mp.preparers.aDevice2,
        function () {
          done();
        }
      ]);
    });

    it('remove device from user', function (done) {
      console.log(mp.device2.id);
      db.removeDevice(mp.user2.pseudo, mp.device2.id, function (e, d) {
        should.not.exist(e);
        console.log(d);
        should(d.devices.length).be.equal(0);
        db.getUser(mp.user2, function () {
          done();
        });
      });
    });

  });

  describe('#removeUser()', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.rGroupDB,
        mp.preparers.rDeviceDB,
        mp.preparers.aUser2,
        mp.preparers.aGroup2,
        mp.preparers.aDevice2,
        //mp.preparers.aGroup2, //SI ON RAJOUTE PAS LA LIGNE RAJOUTE PAS LE DEVICE PK?!
        mp.preparers.aDevice2ToGroup2,
        function () {
          done();
        }
      ]);
    });

    it('remove user', function (done) {
      db.removeUser(mp.user2.pseudo, function (e, d) {
        should.not.exist(e);
        console.log(d);
        db.getGroup(d.groups[0], function(err, doc){
          should.not.exist(doc);
          //done();
        });
        db.getDevice(d.devices[0], function(err, doc){
          should.not.exist(doc);
          done();
        });
      });
    });
  });
  describe('#deviceOwnership()', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.rGroupDB,
        mp.preparers.rDeviceDB,
        mp.preparers.aUser2,
        mp.preparers.aUser3,
        mp.preparers.aDevice2,
        mp.preparers.aDevice4,
        function () {
          done();
        }
      ]);
    });

    it('test user 2 should be owner of device 2', function (done) {
      db.getUser(mp.user2.pseudo, function(e,d){
        db.isDeviceOwner(d.id, mp.device2.id, function(result){
          should.not.exist(e);
          should(result).be.equal(true);
          done();
        });
      });
    });
    it('test user 2 should not be owner of device 4', function (done) {
      db.getUser(mp.user2.pseudo, function(e,d){
        db.isDeviceOwner(d.id, mp.device4.id, function(result){
          should.not.exist(e);
          should(result).be.equal(false);
          done();
        });
      });
    })
  });
  describe('#getFullUserById()', function () {
    before(function (done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.rGroupDB,
        mp.preparers.rDeviceDB,
        mp.preparers.aUser2,
          mp.preparers.aDevice2,
        mp.preparers.aGroup2,
        function () {
          done();
        }
      ]);
    });

    it('retrieves user : charlie', function (done) {
      db.getFullUserById(mp.user2.id, function (err, doc) {
        should.not.exist(err);
        console.log(doc);
        should(doc.devices[0].name).be.equal(mp.device2.name);
        should(doc.groups[0].name).be.equal(mp.group2.name);
        done();
      });
    });
  });
});

