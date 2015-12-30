'use strict';

var express = require('express');
var router = express.Router();
var db = require('../../model/db_interface.js');

module.exports = function(passport) {
  router.post('/renameGroup', passport.ensureAuthenticated, passport.isOwnerOfGroup, function(req, res) {
    db.renameGroup(req.body.groupID, req.body.newName, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send({msg: 'ok'});
      }
    });
  });

  router.post('/activate', passport.ensureAuthenticated, passport.isOwnerOfGroup, function(req, res) {
    db.activateGroup(req.body.groupID, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send({msg: 'ok'});
      }
    });
  });

  router.post('/desactivate', passport.ensureAuthenticated, passport.isOwnerOfGroup, function(req, res) {
    db.desactivateGroup(req.body.groupID, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send({msg: 'ok'});
      }
    });
  });

  router.post('/addDeviceToGroup', passport.ensureAuthenticated, passport.isOwnerOfGroup, passport.isOwnerOfDevice,
      function(req, res) {
        console.log('add device to group');
        db.addDeviceToGroup(req.body.groupID, req.body.deviceID, function(err) {
          if (err) {
            res.send(err);
          } else {
            res.send({msg: 'ok'});
          }
        });
      });

  router.post('/removeDeviceFromGroup', passport.ensureAuthenticated, passport.isOwnerOfGroup, passport.isOwnerOfDevice,
      function(req, res) {
        console.log('remove device from group');
        db.removeDeviceFromGroup(req.body.groupID, req.body.deviceID, function(err) {
          if (err) {
            res.send(err);
          } else {
            res.send({msg: 'ok'});
          }
        });
      });


  return router;
};
