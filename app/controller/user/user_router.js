'use strict';
/*global window: false */
var express = require('express');
var router = express.Router();
var url = require('url');


module.exports = function(passport) {
  router.get('/devices', passport.ensureAuthenticated, function(req, res) {
    res.render('public/user/devices', {
      groups: (req.user) ? req.user.groups : null,
      devices: (req.user) ? req.user.devices : null,
      user: (req.user) ? {
        pseudo: req.user.pseudo
      } : null,
      page: {
        account: true
      }
    });
  });

  router.get('/group', passport.ensureAuthenticated, function(req, res) {
    var urlParts = url.parse(req.url, true);
    var devices = req.user.devices;
    var groupID = urlParts.query.group;
    var group = req.user.groups.filter(function(obj) {
      return obj._id == groupID;
    });
    group[0].state = true;
    group[0].devices.forEach(function(device) {
      devices = devices
          .filter(function(el) {
            return el._id+'' !== device._id+'';
          });
      if (!device.state) {
        group[0].state = false;
      }
    });

    res.render('public/user/group', {
      group: (req.user) ? group : null,
      groups: (req.user) ? req.user.groups : null,
      devices: (req.user) ? devices : null,
      user: (req.user) ? {
        pseudo: req.user.pseudo
      } : null
    });
  });

  return router;
};

