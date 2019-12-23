/* eslint-disable sort-keys */
'use-strict';

const sequelize = require('sequelize');

const connection = require('../config');
// const Site = require('./group_model');
// const Site = sequelize.import('./group_model');
const log = require('../../logger');
// const User = require('./user_model');
// const User = sequelize.import('./user_model');
// const UserSites = require('./user_in_group_model');
// const UserSites = sequelize.import('./user_in_group_model');

// //==========================================
// //                                          
// //  ##   ##   ####  #####  #####          
// //  ##   ##  ##     ##     ##  ##         
// //  ##   ##   ###   #####  #####          
// //  ##   ##     ##  ##     ##  ##         
// //   #####   ####   #####  ##   ##        
// //                                          
// //==========================================
const attr_user = {
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
		comment: '这里存储的是密码的hash。密码：长度1- 20位，数字，大小写字母、可打印特殊字符、不允许中文',
		type: sequelize.STRING,
		validate: {
			len: [32, 64],
			notNull: true
		}
	},
	profile: {
		allowNull: false,
		comment: '个人简介：最长50位',
		defaultValue: '你还记得你放过多少鸽子🕊吗',
		type: sequelize.STRING,
		validate: {
			len: [1, 50],
			notNull: true
		}
	},
	uid: {
		allowNull: false,
		comment: '用户展示用的ID',
		field: 'uid',
		type: sequelize.INTEGER,
		unique: true,
		validate: {
			notNull: true
		}
	}
};

class User extends sequelize.Model {}
User.init(attr_user, {
	// indexes: [{
	// 	fields: ['uid'],
	// 	unique: true
	// }],
	sequelize: connection,
	modelName: 'user'
});

//====================================
//                                    
//   ####  ##  ######  #####        
//  ##     ##    ##    ##           
//   ###   ##    ##    #####        
//     ##  ##    ##    ##           
//  ####   ##    ##    #####        
//                                    
//====================================

const attr_site = {
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


class Site extends sequelize.Model {}
Site.init(attr_site, {
	// indexes: [{
	// 	fields: ['gid'],
	// 	unique: true
	// }],
	sequelize: connection,
	modelName: 'site'
});

//=============================================================================
//                                                                             
//    ###     ####   ####   #####    ####  ##    ###    ######  #####        
//   ## ##   ##     ##     ##   ##  ##     ##   ## ##     ##    ##           
//  ##   ##   ###    ###   ##   ##  ##     ##  ##   ##    ##    #####        
//  #######     ##     ##  ##   ##  ##     ##  #######    ##    ##           
//  ##   ##  ####   ####    #####    ####  ##  ##   ##    ##    #####        
//                                                                             
//=============================================================================

const attr_uis = {
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
};
class UserSites extends sequelize.Model {}
UserSites.init(attr_uis, {
	sequelize: connection,
	modelName: 'userSites'
});

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