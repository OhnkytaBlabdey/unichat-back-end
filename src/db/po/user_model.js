'use-strict';

const connection = require('../config');
const log = require('../../logger');
const sequelize = require('sequelize');

// const User = sequelize.define('user', {
const User = connection.define('t_user', {
	avatar: {
		allowNull: false,
		comment: '头像',
		type: sequelize.STRING,
		validate: {
			is: ['^https://i.loli.net/*'],
			isUrl: true,
			notNull: true
		}
	},
	email_addr: {
		allowNull: false,
		comment: '邮箱',
		type: sequelize.STRING,
		// unique:true,
		validate: {
			isEmail: true,
			notNull: true
		}
	},
	nickname: {
		allowNull: false,
		comment: '昵称 长度 2 - 10位',
		type: sequelize.STRING,
		unique: true,
		validate: {
			len: [2, 10],
			notNull: true
		}
	},
	password_hash: {
		allowNull: false,
		comment: '密码：长度1- 20位，数字，大小写字母、可打印特殊字符、不允许中文',
		type: sequelize.STRING,
		validate: {
			len: [32, 64],
			notNull: true
		}
	},
	profile: {
		allowNull: false,
		comment: '个人简介：最长50位',
		default: '你还记得你放过多少鸽子🕊吗',
		type: sequelize.STRING,
		validate: {
			len: [1, 50],
			notNull: true
		}
	},
	uid: {
		allowNull: false,
		comment: '用户展示用的ID',
		type: sequelize.INTEGER,
		unique: true,
		validate: {
			notNull: true
		}
	}
}, {
	timestamp: true
});
log.info(User);
module.exports = User;