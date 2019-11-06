'use-strict';
const log = require('./logger');
const User = require('./db/po/user_model');
const url = require('url');


const services = {
	signup: (req, res) => {
		const params = url.parse(req.url, true).query;
		log.info(`signup request ${JSON.stringify(params)}`);
		let result = {};
		const nickname = params.nickname;
		const passwordHash = params.passwordHash;
		const emailAddr = params.emailAddr;
		const profile = params.profile || 'this guy has no profile';

		if (!(nickname && passwordHash && emailAddr)) {
			res.send({
				status: 'failed',
				desc: 'param needed'
			});
		}

		/* 
		const avatar = null;
		const uid = null; */
		User.findOne({
				where: {
					nickname: nickname
				}
			}).catch((err) => {
				if (err) {
					log.error({
						dberr: err
					});
					res.send({
						status: 'internal error',
						desc: err.parent.code
					});
				}
			})
			.then((user) => {
				if (user) {
					log.info(`nickname [${nickname}] has been taken by user [${JSON.stringify(user)}]`);
					result['status'] = 'failed';
					result['desc'] = `nickname [${nickname}] has been taken.`;
					result['msg'] = `昵称${nickname}已被占用`;
					res.send(JSON.stringify(result));
				} else {
					User.create({
						nickname: nickname,
						password_hash: passwordHash,
						email_addr: emailAddr,
						profile: profile,
						uid: 6,
						avatar: '/'
					}).then((user) => {
						log.info(`user ${JSON.stringify(user)} signed up successfully.`);
						result['status'] = 'ok';
						res.send(JSON.stringify(result));
					});
				}
			});
	}
};

module.exports = services;