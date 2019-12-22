'use-strict';

// const sequelize = require('sequelize');

// const connection = require('../config');
const Group = require('./group_model');
const log = require('../../logger');
const User = require('./user_model');
const UserInGroup = require('./user_in_group_model');

User.belongsToMany(Group, {
	as: 'Users',
	foreignKey: 'user_id',
	otherKey: 'group_id',
	sourceKey: 'uid',
	through: UserInGroup
});
Group.belongsToMany(User, {
	as: 'Groups',
	foreignKey: 'group_id',
	otherKey: 'user_id',
	sourceKey: 'gid',
	through: UserInGroup
});
log.info(UserInGroup);
log.info(User);
log.info(Group);

const Model = {
	group: Group,
	user: User,
	userInGroup: UserInGroup
};

// (async () => {
// 	await connection.sync({
// 		forced: false
// 	});
// })();
module.exports = Model;