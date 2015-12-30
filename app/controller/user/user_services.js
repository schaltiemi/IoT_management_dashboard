'use strict';

var express = require('express');
var router = express.Router();
var db = require('../../model/db_interface.js');

module.exports = function(passport) {

  router.post('/delete', passport.ensureAuthenticated, function(req, res) {
    db.removeUser(req.user.pseudo, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send({msg: 'ok'});
      }
    });
  });

  router.post('/createGroup', passport.ensureAuthenticated, function(req, res) {
    console.log('aze');
    db.addGroupToUser(req.user.pseudo, req.body.groupName, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send({msg: 'ok'});
      }
    });
  });

  router.post('/deleteGroup', passport.ensureAuthenticated, function(req, res) {
    db.removeGroup(req.user.pseudo, req.body.groupID, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send({msg: 'ok'});
      }
    });
  });

  router.post('/addDevice', passport.ensureAuthenticated, function(req, res) {
    db.addDeviceToUser(req.user.pseudo, req.body.deviceName, req.body.deviceUid, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send({msg: 'ok'});
      }
    });
  });

  router.post('/removeDevice', passport.ensureAuthenticated, function(req, res) {
    db.removeDevice(req.user.pseudo, req.body.deviceId, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send({msg: 'ok'});
      }
    });
  });

  return router;
};
