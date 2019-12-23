'use-strict';

const Sequelize = require('sequelize');

const connection = require('../config');
const log = require('../../logger');

const attr_user = {
	avatar: {
		allowNull: false,
		comment: '头像',
		type: Sequelize.STRING,
		validate: {
			is: ['^https://i.loli.net/*'],
			isUrl: true,
			notNull: true
		}
	},
	email_addr: {
		allowNull: false,
		comment: '邮箱',
		type: Sequelize.STRING,
		// unique:true,
		validate: {
			isEmail: true,
			notNull: true
		}
	},
	nickname: {
		allowNull: false,
		comment: '昵称 长度 2 - 10位',
		type: Sequelize.STRING,
		unique: true,
		validate: {
			len: [2, 10],
			notNull: true
		}
	},
	password_hash: {
		allowNull: false,
		comment: '这里存储的是密码的hash。密码：长度1- 20位，数字，大小写字母、可打印特殊字符、不允许中文',
		type: Sequelize.STRING,
		validate: {
			len: [32, 64],
			notNull: true
		}
	},
	profile: {
		allowNull: false,
		comment: '个人简介：最长50位',
		defaultValue: '你还记得你放过多少鸽子🕊吗',
		type: Sequelize.STRING,
		validate: {
			len: [1, 50],
			notNull: true
		}
	},
	uid: {
		allowNull: false,
		comment: '用户展示用的ID',
		field: 'uid',
		type: Sequelize.INTEGER,
		unique: true,
		validate: {
			notNull: true
		}
	}
};

class User extends Sequelize.Model {}
User.init(attr_user, {
	// indexes: [{
	// 	fields: ['uid'],
	// 	unique: true
	// }],
	sequelize: connection,
	modelName: 'user'
});
log.info(attr_user);
module.exports = User;