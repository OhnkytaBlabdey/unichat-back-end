'use-strict';

const sequelize = require('sequelize');

const connection = require('../config');
const log = require('../../logger');

const config = {
	gid: {
		allowNull: false,
		comment: '群聊展示用的ID',
		field: 'gid',
		type: sequelize.INTEGER,
		unique: true,
		validate: {
			notNull: true
		}
	},
	invite_code: {
		allowNull: false,
		comment: '入群码',
		type: sequelize.STRING,
		validate: {
			len: [6, 6],
			notNull: true
		}
	},
	logo: {
		allowNull: false,
		comment: '群头像',
		type: sequelize.STRING,
		validate: {
			is: ['^https://i.loli.net/*'],
			isUrl: true,
			notNull: true
		}
	},
	name: {
		allowNull: false,
		comment: '群名：2-20',
		type: sequelize.STRING,
		validate: {
			len: [2, 20],
			notNull: true
		}
	}
};

// const Group = connection.define('t_group', config, {
const Group = connection.define('group', config, {
	indexes: [{
		fields: ['gid'],
		unique: true
	}]
});
log.info(config);
module.exports = Group;