'use-strict';

const log = require('../../logger');
const conn = require('../config');

require('./models');
// const list = [
// 	'./user_model',
// 	'./group_model',
// 	// './message_model',
// 	// './channel_model',
// 	'./user_in_group_model'
// 	// './channel_in_group_model'
// ];
// let models = [];
// for (const model of list) {
// 	models.push(require(model));
// }
log.warn('Note: All tables in database will be DROPPED!');
log.warn('注意：数据库中所有的表都会被删除！');
setTimeout(
	async () => {
		conn.sync({
			force: true
		});
	}, 1000);