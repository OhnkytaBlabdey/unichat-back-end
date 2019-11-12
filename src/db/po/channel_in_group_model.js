'use-strict';
const defineModel = require('./db_define_model');
const log = require('../../logger');
const ChannelInGroup = defineModel('channel_in_group');
log.info(ChannelInGroup);
module.exports = ChannelInGroup;