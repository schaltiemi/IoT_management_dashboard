'use strict';
/* globals describe, it, before, after */

var should = require('should');
require('should-http');
var supertest = require('supertest');
var cp = require('./controller_preparer');
var mp = require('../model/model_preparer');
var db = require('../../app/model/db_interface');

var agent = supertest.agent(require('../../app/controller/express_server.js'));

describe('Routing client services', function() {
  after(function(done) {
    mp.preparers.chainPreparers([
      mp.preparers.rUserDB,
      mp.preparers.rGroupDB,
      mp.preparers.rDeviceDB,
      function() {
        done();
      }
    ]);
  });

  describe('POST /register', function() {
    before(function(done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        function() {
          done();
        }
      ]);
    });

    it('register a new user', function(done) {
      agent.post('/register').send({
        pseudo: cp.user1.pseudo,
        password: cp.user1.password,
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        should(res.body.msg).be.equal('ok');
        db.getUser(cp.user1.pseudo, function(err, doc) {
          should.not.exist(err);
          should(doc.password).be.equal(cp.user1.password);
          should(doc.pseudo).be.equal(cp.user1.pseudo);
          done();
        });
      });
    });

    it('can\'t register ever exists', function(done) {
      agent.post('/register').send({
        password: cp.user1.password,
        pseudo: cp.user1.pseudo
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        should(res.body.msg).be.equal('pseudo already exists');
        done();
      });
    });

    it('can\'t register no pseudo', function(done) {
      agent.post('/register').send({
        password: cp.user1.password,
        pseudo: null
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        should(res.body.msg).be.equal('pseudo needed');
        done();
      });
    });

    it('can\'t register no password', function(done) {
      agent.post('/register').send({
        password: null,
        pseudo: cp.user1.pseudo
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        should(res.body.msg).be.equal('password needed');
        done();
      });
    });
  });

  describe('/login', function() {
    before(function(done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.aUser1,
        function() {
          done();
        }
      ]);
    });

    it('login user', function(done) {
      agent.post('/login').send({
        pseudo: cp.user1.pseudo,
        password: cp.user1.password
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        should(res.body.msg).be.equal('ok');
        done();
      });
    });

    it('fail wrong password', function(done) {
      agent.post('/login').send({
        pseudo: cp.user1.pseudo,
        password: 'wrong'
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });

    it('fail wrong pseudo', function(done) {
      agent.post('/login').send({
        pseudo: 'wrong',
        password: cp.user1.password
      }).end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(401);
        done();
      });
    });
  });

  describe('/logout', function() {
    before(function(done) {
      mp.preparers.chainPreparers([
        mp.preparers.rUserDB,
        mp.preparers.aUser1,
        function() {
          agent.post('/login').send({
            pseudo: cp.user1.pseudo,
            password: cp.user1.password
          }).end(function() {
            done();
          });
        }
      ]);
    });

    it('log out the user', function(done) {
      agent.post('/logout').send().end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(302);
        res.should.have.header('location', '/home');
        // TODO check with private part
        done();
      });
    });
  });
});
