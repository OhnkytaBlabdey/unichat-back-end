'use-strict';

const crypto = require('crypto');

const captchaHandler = require('../util/handleCaptcha');
const errorHandler = require('../util/handleInternalError');
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
 * @author Ohnkyta <ohnkyta@163.com>
 * @public
 * @example /signup
 * @param {Request} req
 * @param {Response} res
 * @param {String} nickname 用户昵称
 * @param {String} password 用户密码（明文）
 * @param {email} emailAddr 用户邮箱
 * @param {String|null} profile 用户签名档【缺省】
 * @param {String|null} avatar 用户头像【缺省】
 * @param {String} captcha 验证码
 * @returns {OK|FAILED|UNAUTHORIZED} status
 * @returns {URL} avatar 头像
 * @returns {String} nickname 昵称
 * @returns {Number} uid 用户ID
 */
const SignUp = (req, res, nickname, password, emailAddr, profile, avatar) => {
	if (!captchaHandler(req, res)) return;
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
		errorHandler(res, err, 'checking duplicated username');
	}).then((ct) => {
		if (ct) {
			log.info(`nickname [${nickname}] has been taken.`);
			sendMsg(res, Status.FAILED,
				`昵称[${nickname}]已被占用`,
				`nickname [${nickname}] has been taken.`);
		} else {
			User.max('id').catch((err) => {
				errorHandler(res, err, 'signup 2');
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
						if (err.name === 'SequelizeValidationError') {
							sendMsg(res, Status.FAILED,
								'您的注册信息不符合要求',
								'ValidationError', err.errors);
						} else {
							errorHandler(res, err, 'signup 2');
						}
						return;
					}
				}).then((user) => {
					if (user) {
						log.info('user signed up successfully.', user);
						sendMsg(res, Status.OK, '注册成功', null, {
							avatar: avatar,
							nickname: user.nickname,
							uid: user.uid
						});
					} else {
						sendMsg();
					}
				});
			});
		}
	});
};

/**
 * 用户注册
 * 前提：用户输入正确的字段信息，符合约束，验证码正确
 * 结果：在库里添加用户记录，告诉用户注册成功，以及分配的uid
 * @private
 * @param {Request} req
 * @param {Response} res
 */
const SignUpCB = (req, res) => {
	// 解析请求
	const params = req.para;
	log.info(`\nsignup request ${JSON.stringify(params)}`);
	const nickname = params.nickname;
	const password = params.password;
	const emailAddr = params.emailAddr;
	const profile = params.profile;
	const avatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
	SignUp(req, res, nickname, password, emailAddr, profile, avatar);
};

module.exports = SignUpCB;