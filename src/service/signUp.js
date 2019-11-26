'use-strict';

const crypto = require('crypto');
const log = require('../logger');
const Status = require('../status');
const User = require('../db/po/user_model');
const getId = require('../util/uidGen');

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
 * @param {*} req
 * @param {*} res
 * @returns
 */
const SignUp = (req, res) => {
	// 解析请求
	// postData = querystring.parse();
	let params = req.body;
	// const params = req.body;
	log.info(`\nsignup request ${JSON.stringify(params)}`);
	let result = {};
	const nickname = params.nickname;
	const password = params.password;
	const emailAddr = params.emailAddr;
	const profile = params.profile || 'this guy has no profile';
	const avatarUrl = 'https://i.loli.net/';
	const captcha = params.captcha;
	if (!req.session.captcha ||
		!captcha ||
		captcha != req.session.captcha
	) {
		log.debug('invalid request for signup');
		log.debug(`captcha:${captcha}`);
		log.debug(`session.captcha:${req.session.captcha}`);
		res.send({
			desc: 'invalid captcha',
			msg: '验证码错误',
			status: Status.UNAUTHORIZED
		});
		req.session.captcha = null;
		return;
	}

	req.session.captcha = null;
	if (!(nickname && password && emailAddr)) {
		res.send({
			desc: 'param needed',
			msg: '昵称、密码和邮件地址不能为空',
			status: Status.FAILED
		});
		return;
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
				desc: `internal error${err.parent.code}`,
				msg: '内部错误',
				status: Status.FAILED
			});
			return;
		}
	}).then((user) => {
		if (user) {
			log.info(
				`nickname [${nickname}] has been taken by user [${JSON.stringify(
							user
						)}]`
			);
			result['status'] = Status.FAILED;
			result['desc'] = `nickname [${nickname}] has been taken.`;
			result['msg'] = `昵称[${nickname}]已被占用`;
			res.send(JSON.stringify(result));
		} else {
			User.max('id').catch((err) => {
				if (err) {
					log.warn(err);
					res.send({
						msg: 'internal error',
						status: Status.FAILED
					});
					return;
				}
			}).then((maxid) => {
				if (!maxid) maxid = 0;
				const uid = getId(maxid);
				const hash = crypto.createHash('sha256');
				hash.update(password);
				const passwordHash = hash.digest('hex');
				User.create({
					avatar: avatarUrl,
					email_addr: emailAddr,
					nickname: nickname,
					password_hash: passwordHash,
					profile: profile,
					uid: uid
				}).catch((err) => {
					if (err) {
						log.error({
							dberr: err
						});
					} else {
						return;
					}
					if (err.name === 'SequelizeValidationError') {
						res.send({
							desc: 'ValidationError',
							error: err.errors,
							msg: '您的注册信息不符合要求',
							status: Status.FAILED
						});
					} else {
						res.send({
							desc: 'internal error.',
							msg: '内部错误',
							status: Status.FAILED
						});
					}
				}).then(user => {
					log.info(
						`user ${JSON.stringify(
								user
							)} signed up successfully.`
					);
					result['status'] = Status.OK;
					result['desc'] = {
						nickname: user.nickname,
						uid: user.uid
					};
					result['msg'] = '注册成功';
					res.send(JSON.stringify(result));
				});
			});
		}
	});
};

module.exports = SignUp;