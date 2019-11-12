'use-strict';
const defineModel = require('./db_define_model');
const log = require('../../logger');
const Channel = defineModel('channel');
log.info(Channel);
module.exports = Channel;