"use-strict";
const defineModel = require('./db_define_model');
const log = require('../../logger');
const User = defineModel('user');
log.info(User);
module.exports = User;