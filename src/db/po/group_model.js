"use-strict";
const defineModel = require('./db_define_model');
const log = require('../../logger');
const Group = defineModel('group');
log.info(Group);
module.exports = Group;