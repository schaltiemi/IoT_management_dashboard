'use strict';

var express = require('express');
var router = express.Router();
var db = require('../../model/db_interface.js');

module.exports = function(passport) {

  router.post('/register', function(req, res) {
    db.addUser(req.body.pseudo, req.body.password, function(err) {
      if (err) {
        if (err.code === 11000) {
          res.send({msg: 'pseudo already exists'});
        } else if (err.toString().indexOf('pseudo') >= 0) {
          res.send({msg: 'pseudo needed'});
        } else if (err.toString().indexOf('password') >= 0) {
          res.send({msg: 'password needed'});
        } else {
          res.send(err);
        }
      } else {
        res.send({msg: 'ok'});
      }
    });
  });

  router.post('/login', passport.authenticate('local'), function(req, res) {
    res.send({msg: 'ok'});
  });

  router.post('/logout', function(req, res) {
    req.logout();
    res.redirect('/home');
  });

  return router;
};

