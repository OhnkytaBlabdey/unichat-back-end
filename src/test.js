// 'use-strict';
// const model = require('./db/po/models');

// (async () => {
// 	model.user.findOrCreate({
// 		where: {
// 			avatar: 'https://i.loli.net/2019/11/27/x89khWu1oPBlHsb.jpg',
// 			email_addr: '123@qq.com',
// 			nickname: '456852',
// 			password_hash: '2ac9a6746aca543af8dff39894cfe8173afba21eb01c6fae33d52947222855ef',
// 			profile: 'this guy has no profile',
// 			uid: 789123654
// 		}
// 	}).then(user => {
// 		model.group.findOrCreate({
// 			where: {
// 				gid: '225566',
// 				invite_code: '123jkl',
// 				logo: 'https://i.loli.net/2019/11/27/x89khWu1oPBlHsb.jpg',
// 				name: 'gugugu'
// 			}
// 		}).then(group => {
// 			// user.addGroups([group]).then(() => {
// 			user.addGroup(group, {
// 				through: {
// 					role: 'admin'
// 				}
// 			}).then(() => {
// 				console.log('fin');
// 			}).catch(err => {
// 				if (err) {
// 					console.warn(err);
// 					return;
// 				}
// 			});
// 		}).catch(err => {
// 			if (err) {
// 				console.warn(err);
// 				return;
// 			}
// 		});
// 	}).catch(err => {
// 		if (err) {
// 			console.warn(err);
// 			return;
// 		}
// 	});
// })();


const connection = require('./db/config');
const Sequelize = require('sequelize');
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
// 	through: ManPigs,
// 	foreignKey: 1
// });
// Pig.belongsToMany(Man, {
// 	as: 'Tasks',
// 	through: ManPigs,
// 	foreignKey: 1
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

const DataTypes = Sequelize.DataTypes;
const User = connection.define('User', {
	id: {
		type: DataTypes.UUID,
		allowNull: false,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
		field: 'user_id'
	},
	userSecondId: {
		type: DataTypes.UUID,
		allowNull: false,
		defaultValue: DataTypes.UUIDV4,
		field: 'user_second_id'
	}
}, {
	tableName: 'tbl_user',
	indexes: [{
		unique: true,
		fields: ['user_second_id']
	}]
});

const Group = connection.define('Group', {
	id: {
		type: DataTypes.UUID,
		allowNull: false,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
		field: 'group_id'
	},
	groupSecondId: {
		type: DataTypes.UUID,
		allowNull: false,
		defaultValue: DataTypes.UUIDV4,
		field: 'group_second_id'
	}
}, {
	tableName: 'tbl_group',
	indexes: [{
		unique: true,
		fields: ['group_second_id']
	}]
});

User.belongsToMany(Group, {
	through: 'usergroups',
	sourceKey: 'userSecondId'
});
Group.belongsToMany(User, {
	through: 'usergroups',
	sourceKey: 'groupSecondId'
});
connection.sync({
	force: true
});
// .then(() => {
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