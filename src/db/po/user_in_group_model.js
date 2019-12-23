'use-strict';

const Sequelize = require('sequelize');

const connection = require('../config');

const attr_uis = {
	role: {
		allowNull: false,
		comment: '用户在群里的角色',
		type: Sequelize.DataTypes.ENUM,
		validate: {
			notNull: true
		},
		values: [
			'owner',
			'admin',
			'normal',
			'banned'
		]
	}
};
class UserSites extends Sequelize.Model {}
UserSites.init(attr_uis, {
	sequelize: connection,
	modelName: 'userSites'
});
module.exports = UserSites;