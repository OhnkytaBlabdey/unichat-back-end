/* eslint-disable sort-keys */
'use-strict';
const model = require('./db/po/models');
const log = require('./logger');

const t1 = (async () => {
	model.user.findOrCreate({
		where: {
			avatar: 'https://i.loli.net/2019/11/27/x89khWu1oPBlHsb.jpg',
			email_addr: '123@qq.com',
			nickname: '456852',
			password_hash: '2ac9a6746aca543af8dff39894cfe8173afba21eb01c6fae33d52947222855ef',
			uid: 789123654
		}
	}).then((user) => {
		log.info(user);
		model.group.findOrCreate({
			where: {
				gid: '225566',
				invite_code: '123jkl',
				logo: 'https://i.loli.net/2019/11/27/x89khWu1oPBlHsb.jpg',
				name: 'gugugu'
			}
		}).then((site) => {
			log.info(site);
			// user.addGroups([group], {
			user.addSite(site, {
					through: {
						role: 'admin'
					}
				})
				.then(() => {
					console.log('fin');
				}).catch(err => {
					if (err) {
						console.warn(err);
						return;
					}
				});
		}).catch(err => {
			if (err) {
				console.warn(err);
				return;
			}
		});
	}).catch(err => {
		if (err) {
			console.warn(err);
			return;
		}
	});
});
// t1();

const connection = require('./db/config');
const Sequelize = require('sequelize');

const t2 = () => {
	// class User extends Sequelize.Model {}
	// User.init({
	// 	uid: {
	// 		allowNull: false,
	// 		comment: '用户展示用的ID',
	// 		field: 'uid',
	// 		type: Sequelize.INTEGER,
	// 		unique: true,
	// 		validate: {
	// 			notNull: true
	// 		}
	// 	}
	// }, {
	// 	Sequelize: connection,
	// 	modelName: 'user'
	// });
	// class Site extends Sequelize.Model {}
	// Site.init({
	// 	gid: {
	// 		allowNull: false,
	// 		comment: '群聊展示用的ID',
	// 		field: 'gid',
	// 		type: Sequelize.INTEGER,
	// 		unique: true,
	// 		validate: {
	// 			notNull: true
	// 		}
	// 	}
	// }, {
	// 	Sequelize: connection,
	// 	modelName: 'site'
	// });
	// class UserSites extends Sequelize.Model {}
	// UserSites.init({
	// 	role: {
	// 		allowNull: false,
	// 		comment: '用户在群里的角色',
	// 		type: Sequelize.DataTypes.ENUM,
	// 		validate: {
	// 			notNull: true
	// 		},
	// 		values: [
	// 			'owner',
	// 			'admin',
	// 			'normal',
	// 			'banned'
	// 		]
	// 	}
	// }, {
	// 	Sequelize: connection,
	// 	modelName: 'userSites'
	// });

	// User.belongsToMany(Site, {
	// 	sourceKey: 'uid',
	// 	through: UserSites
	// });
	// Site.belongsToMany(User, {
	// 	sourceKey: 'gid',
	// 	through: UserSites
	// });
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

	User.belongsToMany(Site, {
		sourceKey: 'uid',
		through: UserSites
	});
	Site.belongsToMany(User, {
		sourceKey: 'gid',
		through: UserSites
	});
	connection.sync({
		force: true
	}).then(() => {
		// Site.findOrCreate({
		Site.create({
			gid: '225566',
			invite_code: '123jkl',
			logo: 'https://i.loli.net/2019/11/27/x89khWu1oPBlHsb.jpg',
			name: 'gugugu'
		}).then((site) => {
			// User.findOrCreate({
			User.create({
				avatar: 'https://i.loli.net/2019/11/27/x89khWu1oPBlHsb.jpg',
				email_addr: '123@qq.com',
				nickname: '456852',
				password_hash: '2ac9a6746aca543af8dff39894cfe8173afba21eb01c6fae33d52947222855ef',
				uid: 789123654
			}).then((user) => {
				user.addSite(site, {
					through: {
						role: 'admin'
					}
				}).then(() => {
					console.log('fin');
				});
			});
		});
	});
};
// t1();
t2();

// var Man = connection.define('man', {
// 	title: Sequelize.STRING
// });
// var Pig = connection.define('pig', {
// 	title: Sequelize.STRING
// });
// var ManPigs = connection.define('manPigs', {
// 	status: Sequelize.STRING
// });

// Man.belongsToMany(Pig, {
// 	as: 'Workers',
// 	through: ManPigs
// });
// Pig.belongsToMany(Man, {
// 	as: {
// 		plural: 'Tasks',
// 		singular: 'Task'
// 	},
// 	through: ManPigs
// });
// connection.sync({
// 	force: true
// }).then(() => {
// 	Pig.create({
// 		title: 'ISD Corp'
// 	}).then((pig) => {
// 		Man.create().then((man) => {
// 			man.addTask(pig, {
// 				status: 'started'
// 			}).then(() => {
// 				// finished
// 				console.log('fin');
// 			});
// 		});
// 	});
// });

// const DataTypes = Sequelize.DataTypes;
// const User = connection.define('User', {
// 	id: {
// 		type: DataTypes.UUID,
// 		allowNull: false,
// 		primaryKey: true,
// 		defaultValue: DataTypes.UUIDV4,
// 		field: 'user_id'
// 	},
// 	userSecondId: {
// 		type: DataTypes.UUID,
// 		allowNull: false,
// 		defaultValue: DataTypes.UUIDV4,
// 		field: 'user_second_id'
// 	}
// }, {
// 	tableName: 'tbl_user',
// 	indexes: [{
// 		unique: true,
// 		fields: ['user_second_id']
// 	}]
// });

// const Group = connection.define('Group', {
// 	id: {
// 		type: DataTypes.UUID,
// 		allowNull: false,
// 		primaryKey: true,
// 		defaultValue: DataTypes.UUIDV4,
// 		field: 'group_id'
// 	},
// 	groupSecondId: {
// 		type: DataTypes.UUID,
// 		allowNull: false,
// 		defaultValue: DataTypes.UUIDV4,
// 		field: 'group_second_id'
// 	}
// }, {
// 	tableName: 'tbl_group',
// 	indexes: [{
// 		unique: true,
// 		fields: ['group_second_id']
// 	}]
// });

// User.belongsToMany(Group, {
// 	through: 'usergroups',
// 	sourceKey: 'userSecondId'
// });
// Group.belongsToMany(User, {
// 	through: 'usergroups',
// 	sourceKey: 'groupSecondId'
// });
// connection.sync({
// 		force: true
// 	})
// 	.then(() => {
// 		Pig.create({
// 			title: 'ISD Corp'
// 		}).then((pig) => {
// 			Man.create().then((man) => {
// 				man.addTask(pig, {
// 					status: 'started'
// 				}).then(() => {
// 					// finished
// 					console.log('fin');
// 				});
// 			});
// 		});
// 	});