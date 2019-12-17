'use-strict';

const Sequelize = require('sequelize');
const url = require('url');
const Op = Sequelize.Op;
const crypto = require('crypto');

const log = require('../logger');
const Status = require('../status');
const User = require('../db/po/user_model');

//==================================================
//                                                  
//   ####  ##   ####    ##     ##  ##  ##     ##  
//  ##     ##  ##       ####   ##  ##  ####   ##  
//   ###   ##  ##  ###  ##  ## ##  ##  ##  ## ##  
//     ##  ##  ##   ##  ##    ###  ##  ##    ###  
//  ####   ##   ####    ##     ##  ##  ##     ##  
//                                                  
//==================================================
/**
 * 用户登录
 * 前提：用户在数据库内有注册记录
 * 前提：用户输入正确的用户名/邮箱地址、密码hash、验证码
 * 结果：在session中保存用户的登录信息
 * @param {*} req
 * @param {*} res
 * @returns
 */
const SignIn = (req, res) => {
	// 验证码限制
	if (!req.session.captcha) {
		res.send({
			desc: 'invalid captcha',
			msg: '请输入正确的验证码',
			status: Status.UNAUTHORIZED
		});
		return;
	}
	// 解析请求
	let params = null;
	log.info(req.method);
	if (req.method === 'GET') {
		params = url.parse(req.url, true).query;
	}
	if (req.method === 'POST') {
		params = req.body;
	}
	const nickname = params.nickname || null;
	const emailAddr = params.emailAddr || null;
	const passwordHash = params.passwordHash || null;
	const captcha = params.captcha || null;
	// log.info('req', req);
	log.info('params', params);
	if (captcha != req.session.captcha) {
		log.debug(`wrong captcha ${captcha} ${req.session.captcha}`);
		req.session.captcha = null;
		res.send({
			desc: 'wrong captcha',
			msg: '验证码错误',
			status: Status.UNAUTHORIZED
		});
		return;
	}
	log.debug('correct captcha');
	req.session.captcha = null;
	if (
		!passwordHash ||
		!(emailAddr || nickname)
	) {
		log.debug('invalid request for signin');
		res.send({
			desc: 'param needed',
			msg: '请输入完整的用户名/邮箱 和 密码',
			status: Status.FAILED
		});
		return;
	}
	// 查询
	User.findOne({
		where: {
			[Op.or]: [{
					nickname: nickname
				},
				{
					email_addr: emailAddr
				}
			]
			// password_hash: passwordHash
		}
	}).catch((err) => {
		if (err) {
			log.warn({
				error: err
			});
			res.send({
				error: err,
				status: Status.FAILED
			});
			return;
		}
	}).then((user) => {
		if (user) {
			const sha256 = crypto.createHash('sha256');
			sha256.update(user.password_hash + captcha);
			const hash = sha256.digest('hex');
			const isvalid = hash === passwordHash;
			if (!isvalid) {
				res.send({
					desc: 'login failed',
					msg: '登录失败',
					status: Status.FAILED
				});
				return;
			}
			req.session.user = user;
			req.session.isvalid = true;
			res.send({
				msg: '登陆成功',
				status: Status.OK
			});
			return;
		} else {
			res.send({
				desc: 'signin failed',
				msg: '登录失败',
				status: Status.FAILED
			});
			return;
		}
	});
};
module.exports = SignIn;