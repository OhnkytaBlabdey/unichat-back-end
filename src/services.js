'use-strict';
const log = require('./logger');
const User = require('./db/po/user_model');
// const Sequelize = require('sequelize');

const services = {
	signup: (params) => {
		log.info(`signup request ${JSON.stringify(params)}`);
		let result = {};
		const nickname = params.nickname;
		const passwordHash = params.passwordHash;
		const emailAddr = params.emailAddr;
		

		/* const profile = params.profile;
		const avatar = null;
		const uid = null; */
		User.findOne({
			where: {
				nickname: nickname
			}
		}).then((user) => {
			if (user) {
				log.info(`nickname [${nickname}] has been taken by user [${JSON.stringify(user)}]`);
				result['succeeded'] = false;
			} else {
				User.create({
					nickname: nickname,
					password_hash: passwordHash,
					email_addr: emailAddr,
					profile: 'this guy has no profile',
					uid: 6,
					avatar: '/'
				}).then((user) => {
					log.info(`user ${JSON.stringify(user)} signed up successfully.`);
					result['succeeded'] = true;
				});
			}
		});
		return result;
	}
};

module.exports = services;