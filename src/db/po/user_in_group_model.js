'use-strict';
const defineModel = require('./db_define_model');
const log = require('../../logger');
const UserInGroup = defineModel('user_in_group');
log.info(UserInGroup);
module.exports = UserInGroup;