/* eslint-disable sort-keys */
'use-strict';

const Sequelize = require('sequelize');
const connection = require('../config');
const Site = require('./group_model');
const log = require('../../logger');
const User = require('./user_model');
const UserSites = require('./user_in_group_model');

User.belongsToMany(Site, {
	sourceKey: 'uid',
	through: UserSites
});
Site.belongsToMany(User, {
	sourceKey: 'gid',
	through: UserSites
});
log.info(UserSites);
log.info(User);
log.info(Site);

const Model = {
	group: Site,
	user: User,
	userInGroup: UserSites
};

// (async () => {
// 	await connection.sync({
// 		forced: false
// 	});
// })();
module.exports = Model;