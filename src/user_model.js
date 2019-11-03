"use-strict";
const defineModel = require('./db_define_model');
const User = defineModel('user');
console.log(User);
module.exports = User;