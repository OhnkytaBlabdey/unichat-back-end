'use-strict';

const sequelize = require('sequelize');

const connection = require('../config');

const UserInGroup = connection.define('userGroup', {
	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: sequelize.INTEGER
	},
	role: {
		allowNull: false,
		comment: '用户在群里的角色',
		type: sequelize.DataTypes.ENUM,
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
});

module.exports = UserInGroup;