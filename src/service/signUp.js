'use-strict';

const crypto = require('crypto');
const url = require('url');

const getId = require('../util/uidGen');
const log = require('../logger');
const sendMsg = require('../util/sendMsg');
const Status = require('../status');
const User = require('../db/po/user_model');

const defaultAvatars = [
	'https://i.loli.net/2019/11/27/ecbFyZJQXTlRo64.jpg',
	'https://i.loli.net/2019/11/27/jNS8nb2PdLuDUa4.png',
	'https://i.loli.net/2019/11/27/jOAhSILkHlvKg9U.jpg',
	'https://i.loli.net/2019/11/27/oGQXrqcuIjx2YPi.png',
	'https://i.loli.net/2019/11/27/TdVbNCFGgf3wajr.png',
	'https://i.loli.net/2019/11/27/ucNWxiF73IbpEQm.png',
	'https://i.loli.net/2019/11/27/x89khWu1oPBlHsb.jpg',
	'https://i.loli.net/2019/11/27/yceN7TaRSVQzOLG.png',
	'https://i.loli.net/2019/11/27/yCrB5fqItSHZYRM.png',
	'https://i.loli.net/2019/11/27/YfzQ5BU86F1Divh.png'
];

//====================================================================================================================================
//
//  ##   ##   ####  #####  #####          #####    #####   ####    ##   ####  ######  #####  #####
//  ##   ##  ##     ##     ##  ##         ##  ##   ##     ##       ##  ##       ##    ##     ##  ##
//  ##   ##   ###   #####  #####          #####    #####  ##  ###  ##   ###     ##    #####  #####
//  ##   ##     ##  ##     ##  ##         ##  ##   ##     ##   ##  ##     ##    ##    ##     ##  ##
//   #####   ####   #####  ##   ##        ##   ##  #####   ####    ##  ####     ##    #####  ##   ##
//
//====================================================================================================================================
/**
 * 用户注册
 * 前提：用户输入正确的字段信息，符合约束，验证码正确
 * 结果：在库里添加用户记录，告诉用户注册成功，以及分配的uid
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
const SignUp = (req, res) => {
	// 解析请求
	let params = null;
	log.info(req.method);
	if (req.method === 'GET') {
		params = url.parse(req.url, true).query;
	}
	if (req.method === 'POST') {
		params = req.body;
	}
	log.info(`\nsignup request ${JSON.stringify(params)}`);
	const nickname = params.nickname;
	const password = params.password;
	const emailAddr = params.emailAddr;
	const profile = params.profile;
	const avatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
	const captcha = params.captcha;
	if (!req.session.captcha ||
		!captcha ||
		captcha != req.session.captcha
	) {
		log.debug('invalid request for signup');
		log.debug(`captcha:${captcha}`);
		log.debug(`session.captcha:${req.session.captcha}`);
		sendMsg(res, Status.UNAUTHORIZED,
			'验证码错误', 'invalid captcha');
		req.session.captcha = null;
		return;
	}

	req.session.captcha = null;
	if (!(nickname && password && emailAddr)) {
		sendMsg(res, Status.FAILED,
			'昵称、密码和邮件地址不能为空', 'param needed');
		return;
	}

	User.count({
		where: {
			nickname: nickname
		}
	}).catch((err) => {
		if (err) {
			log.error('when checking duplicated username', err);
			res.status(500);
			sendMsg(res, Status.FAILED, '内部错误', 'internal error');
			return;
		}
	}).then((ct) => {
		if (ct) {
			log.info(`nickname [${nickname}] has been taken.`);
			sendMsg(res, Status.FAILED,
				`昵称[${nickname}]已被占用`,
				`nickname [${nickname}] has been taken.`);
		} else {
			User.max('id').catch((err) => {
				if (err) {
					log.warn(err);
					res.status(500);
					sendMsg(res, Status.FAILED, 'internal error');
					return;
				}
			}).then((maxid) => {
				if (!maxid) maxid = 0;
				const uid = getId(maxid);
				const hash = crypto.createHash('sha256');
				hash.update(password);
				const passwordHash = hash.digest('hex');
				User.create({
					avatar: avatar,
					email_addr: emailAddr,
					nickname: nickname,
					password_hash: passwordHash,
					profile: profile,
					uid: uid
				}).catch((err) => {
					if (err) {
						log.warn(err);
					} else {
						return;
					}
					if (err.name === 'SequelizeValidationError') {
						sendMsg(res, Status.FAILED,
							'您的注册信息不符合要求',
							'ValidationError', err.errors);
					} else {
						res.status(500);
						sendMsg(res, Status.FAILED,
							'内部错误', 'internal error');
					}
				}).then(user => {
					log.info('user signed up successfully.', user);
					sendMsg(res, Status.OK, '注册成功', null, {
						avatar: avatar,
						nickname: user.nickname,
						uid: user.uid
					});
				});
			});
		}
	});
};

module.exports = SignUp;