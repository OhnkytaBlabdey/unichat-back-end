'use-strict';
const Sequelize = require('sequelize');
const log = require('../logger');
const fs = require('fs');
const path = require('path');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));
log.debug(config);
const pw = Math.floor(Math.pow(config.a, config.b)) + config.c;

const connection = new Sequelize('unichat', 'OAO', pw, {
	define: {
		charset: 'utf8mb4',
		timestamps: true
	},
	dialect: 'mysql',
	dialectOptions: {
		// requestTimeout: 3
	},
	host: '47.102.140.37',
	isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
	logging: (sql) => {
		log.warn(sql);
	},
	omitNull: true,
	pool: {
		max: 3,
		maxIdleTime: 1 * 60 * 1000,
		min: 0
	},
	port: '3306',
	sycn: {
		force: true
	}
});
connection.authenticate().then(() => {
	log.info('connected.');
	return;
}).catch((err) => {
	if (err) {
		log.warn('connect failed', err);
		return;
	}
});
module.exports = connection;