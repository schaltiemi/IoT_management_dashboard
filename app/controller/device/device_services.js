'use strict';

var express = require('express');
var router = express.Router();
var db = require('../../model/db_interface.js');

module.exports = function(passport) {
  router.post('/renameDevice', passport.ensureAuthenticated, passport.isOwnerOfDevice, function(req, res) {
    db.renameDevice(req.body.deviceID, req.body.newName, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send({msg: 'ok'});
      }
    });
  });

  router.post('/activate', passport.ensureAuthenticated, passport.isOwnerOfDevice, function(req, res) {
    db.activateDevice(req.body.deviceID, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send({msg: 'ok'});
      }
    });
  });

  router.post('/desactivate', passport.ensureAuthenticated, passport.isOwnerOfDevice, function(req, res) {
    db.desactivateDevice(req.body.deviceID, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send({msg: 'ok'});
      }
    });
  });


  return router;
};

