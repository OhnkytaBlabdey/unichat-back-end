"use-strict";
const Sequelize = require('sequelize');
const log = require('../logger');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('src/db/config.json'));
const pw = Math.floor(Math.pow(config.a, config.b)) + config.c;

const connection = new Sequelize('unichat', 'OAO', pw, {
	host: '47.102.140.37',
	port: '3306',
	dialect: 'mysql',
	pool: {
		min: 0,
		max: 3,
		idle: 10000
	},
	logging: (sql) => {
		log.info(sql);
	},
	omitNull: true,
	define: {
		charset: 'utf8mb4',
		timestamps: true
	},
	sycn: {
		force: true
	},
	isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
});

module.exports = connection;