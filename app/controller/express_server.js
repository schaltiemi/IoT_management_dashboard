'use strict';

var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var exphbs = require('express-handlebars');

require('./passport_configuration.js')(passport);
var client = require('./common/common_router')(passport);
var clientServices = require('./common/common_services')(passport);
// var group = require('./group/group_router')(passport);
var groupServices = require('./group/group_services')(passport);
var user = require('./user/user_router')(passport);
var userServices = require('./user/user_services')(passport);
var deviceServices = require('./device/device_services')(passport);

var hbs = exphbs.create({
  defaultLayout: 'public', partialsDir: ['views/public/partials/']
});

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: require('../config/dev.js').secret, resave: false, saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static('resources'));

app.use('/', client);
app.use('/', clientServices);
// app.use('/group', group);
app.use('/group', groupServices);
app.use('/user', user);
app.use('/user', userServices);
// app.use('/device', device);
app.use('/device', deviceServices);


app.use(function(req, res) {
  res.status(404);
  res.render('public/404', {
    title: '404 - Not found'
  });
});

module.exports = app;
