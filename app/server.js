'use strict';

var winston = require('winston');
var app = require('./controller/express_server.js');

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  winston.log('info', 'Example app listening at http://%s:%s', host, port);
});


