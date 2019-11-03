"use-strict";
const defineModel = require('./db_define_model');
const log = require('./logger');
const Message = defineModel('message');
log.info(Message);
module.exports = Message;