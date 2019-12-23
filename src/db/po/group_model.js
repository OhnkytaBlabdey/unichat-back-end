'use-strict';

const Sequelize = require('sequelize');

const connection = require('../config');
const log = require('../../logger');

const attr_site = {
	gid: {
		allowNull: false,
		comment: '群聊展示用的ID',
		field: 'gid',
		type: Sequelize.INTEGER,
		unique: true,
		validate: {
			notNull: true
		}
	},
	invite_code: {
		allowNull: false,
		comment: '入群码',
		type: Sequelize.STRING,
		validate: {
			len: [6, 6],
			notNull: true
		}
	},
	logo: {
		allowNull: false,
		comment: '群头像',
		type: Sequelize.STRING,
		validate: {
			is: ['^https://i.loli.net/*'],
			isUrl: true,
			notNull: true
		}
	},
	name: {
		allowNull: false,
		comment: '群名：2-20',
		type: Sequelize.STRING,
		validate: {
			len: [2, 20],
			notNull: true
		}
	}
};


class Site extends Sequelize.Model {}
Site.init(attr_site, {
	// indexes: [{
	// 	fields: ['gid'],
	// 	unique: true
	// }],
	sequelize: connection,
	modelName: 'site'
});
log.info(attr_site);
module.exports = Site;