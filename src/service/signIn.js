'use-strict';

const crypto = require('crypto');
const Sequelize = require('sequelize');
const connection = require('../db/config');
const model = require('../db/po/models');
const Op = Sequelize.Op;

const captchaHandler = require('../util/handleCaptcha');
const errorHandler = require('../util/handleInternalError');
const log = require('../logger');
const sendMsg = require('../util/sendMsg');
const Status = require('../status');

//==================================================
//                                                  
//   ####  ##   ####    ##     ##  ##  ##     ##  
//  ##     ##  ##       ####   ##  ##  ####   ##  
//   ###   ##  ##  ###  ##  ## ##  ##  ##  ## ##  
//     ##  ##  ##   ##  ##    ###  ##  ##    ###  
//  ####   ##   ####    ##     ##  ##  ##     ##  
//                                                  
/**
 * 用户登录
 * 前提：用户在数据库内有注册记录
 * 前提：用户输入正确的用户名/邮箱地址/用户ID、密码hash、验证码
 * 结果：在session中保存用户的登录信息
 * @author Ohnkyta <ohnkyta@163.com>
 * @public
 * @example /signin
 * @param {Request} req
 * @param {Response} res
 * @param {String} nickname
 * @param {String} emailAddr
 * @param {Number} uid
 * @param {String} passwordHash
 * @param {String} captcha
 * @returns {OK|FAILED|UNAUTHORIZED} status
 */
const handleSignIn = (req, res, nickname, emailAddr, uid, passwordHash, captcha) => {
	// 验证码限制
	if (!captchaHandler(req, res)) return;

	if (
		!passwordHash ||
		!(emailAddr || nickname || uid)
	) {
		log.debug('invalid request for signin');
		sendMsg(res, Status.FAILED,
			'请输入完整的用户名/邮箱/用户ID 和 密码', 'param needed');
		return;
	}
	// 查询
	model.user.findOne({
		where: {
			[Op.or]: [{
					nickname: nickname
				},
				{
					email_addr: emailAddr
				},
				{
					uid: uid
				}
			]
			// password_hash: passwordHash
		}
	}).catch((err) => {
		errorHandler(res, err, 'signin 1');
	}).then((user) => {
		if (user) {
			const sha256 = crypto.createHash('sha256');
			sha256.update(user.password_hash + captcha);
			const hash = sha256.digest('hex');
			const isvalid = hash === passwordHash;
			if (!isvalid) {
				sendMsg(res, Status.FAILED,
					'登录失败', 'login failed');
				return;
			}
			log.info(user, 'signed in');
			req.session.user = user;
			req.session.isvalid = true;
			sendMsg(res, Status.OK, '登陆成功');
			return;
		} else {
			sendMsg(res, Status.FAILED,
				'登录失败', 'signin failed');
			return;
		}
	});
};
/**
 * 用户登录
 * 前提：用户在数据库内有注册记录
 * 前提：用户输入正确的用户名/邮箱地址/用户ID、密码hash、验证码
 * 结果：在session中保存用户的登录信息
 * @private
 * @param {Request} req
 * @param {Response} res
 */
const SignInCB = (req, res) => {
	// 解析请求
	const params = req.para;
	const nickname = params.nickname || null;
	const emailAddr = params.emailAddr || null;
	const uid = params.uid || null;
	const passwordHash = params.passwordHash || null;
	const captcha = params.captcha || null;
	// log.info('params', params);
	handleSignIn(req, res, nickname, emailAddr, uid, passwordHash, captcha);
};
module.exports = SignInCB;