'use strict';

var express = require('express');
var router = express.Router();

module.exports = function () {
  router.get('/', function (req, res) {
    res.render('public/home', {
      title: 'Home',
      user: (req.user) ? {pseudo: req.user.pseudo} : null,
      groups: (req.user) ? req.user.groups : null,
      devices: (req.user) ? req.user.devices : null,
      page: {
        home: true
      }
    });
  });
  router.get('/register', function(req,res){
    res.render('public/register', {
      title: 'register',
      user: (req.user) ? {pseudo: req.user.pseudo} : null,
      page:{
        login: true
      }
    })
  });
  router.get('/login', function(req, res) {
    res.render('public/login', {
      title: 'Login',
      user: (req.user) ? {pseudo: req.user.pseudo} : null,
      groups: (req.user) ? req.user.groups : null,
      devices: (req.user) ? req.user.devices : null,
      page: {
        login: true
      }
    });
  });
  return router;
};

router.get('/home', function(req, res) {
 res.redirect('/');
 });

/*
 router.get('/register', function(req,res){
 res.render('/user/register', {
 title: 'register',
 user: (req.user) ? {pseudo: req.user.pseudo} : null,
 page:{
 login: true
 }
 })
 });

 router.get('/login', function(req,res){

 });

 router.get('/logout', function(req,res){

 });

 router.get('/delete', function(req,res){

 });


 router.get('/401', function(req, res) {
 res.status(401);
 res.render('public/401', {
 title: '401 - Unauthorized'
 });
 });

 router.get('/403', function(req, res) {
 res.status(403);
 res.render('public/403', {
 title: '403 - Forbidden'
 });
 });
 */

