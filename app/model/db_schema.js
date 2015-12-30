'use strict';

var mongoose = require('mongoose');
mongoose.connect(require('../config/dev').mongo);
var Schema = mongoose.Schema;

var userSchema = Schema({
  pseudo: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  devices: [{type: Schema.Types.ObjectId, ref: 'Device'}],
  groups: [{type: Schema.Types.ObjectId, ref: 'Group'}],
  active: {type: Boolean, required: true, default: true}
});

var groupSchema = Schema({
  name: {type: String, required: true}, devices: [{type: Schema.Types.ObjectId, ref: 'Device'}]
});

var deviceSchema = Schema({
  name: {type: String, required: true},
  uid: {type: String, required: true, unique: true}, // group: [{type: Schema.Types.ObjectId, ref: 'Group'}],
  state: {type: Boolean, default: false}
});

module.exports = {
  disconnect: function() {
    mongoose.disconnect();
  }, user: function() {
    return mongoose.model('Users', userSchema);
  }, group: function() {
    return mongoose.model('Group', groupSchema);
  }, device: function() {
    return mongoose.model('Device', deviceSchema);
  }
};