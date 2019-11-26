'use-strict';
const Sequelize = require('sequelize');
const log = require('../logger');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('src/db/config.json'));
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
		maxIdleTime: 10000,
		min: 0
	},
	port: '3306',
	sycn: {
		force: true
	}
});

module.exports = connection;