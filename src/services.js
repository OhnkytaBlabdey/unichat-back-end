'use-strict';
const log = require('./logger');
const User = require('./db/po/user_model');
const url = require('url');
const Status = require('./status');
const svgCaptcha = require('svg-captcha');
const crypto = require('crypto');
const hash = crypto.createHash('sha256');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const services = {
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
	 *
	 *
	 * @param {*} req
	 * @param {*} res
	 * @returns
	 */
	signup: (req, res) => {
		const params = url.parse(req.url, true).query;
		log.info(`signup request ${JSON.stringify(params)}`);
		let result = {};
		const nickname = params.nickname;
		const password = params.password;
		const emailAddr = params.emailAddr;
		const profile = params.profile || 'this guy has no profile';
		const uid = 6;
		const avatarUrl = '#';
		const captcha = params.captcha;
		if (
			!req.session.captcha ||
			!captcha ||
			captcha != req.session.captcha
		) {
			log.debug('invalid request');
			res.send({
				status: Status.UNAUTHORIZED,
				desc: 'invalid captcha',
				msg: '验证码错误'
			});
			req.session.captcha = null;
			return;
		}

		req.session.captcha = null;
		if (!(nickname && password && emailAddr)) {
			res.send({
				status: Status.FAILED,
				desc: 'param needed',
				msg: '昵称、密码和邮件地址不能为空'
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
			})
			.catch((err) => {
				if (err) {
					log.error({
						dberr: err
					});
					res.send({
						status: Status.FAILED,
						desc: `internal error${err.parent.code}`,
						msg: '内部错误'
					});
					return;
				}
			})
			.then((user) => {
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
					hash.update(password);
					const passwordHash = hash.digest('hex');
					User.create({
							nickname: nickname,
							password_hash: passwordHash,
							email_addr: emailAddr,
							profile: profile,
							uid: uid,
							avatar: avatarUrl
						})
						.then(user => {
							log.info(
								`user ${JSON.stringify(
									user
								)} signed up successfully.`
							);
							result['status'] = Status.OK;
							result['desc'] = user;
							result['msg'] = '注册成功';
							res.send(JSON.stringify(result));
						})
						.catch((err) => {
							if (err) {
								log.error({
									dberr: err
								});
							}
							if (err.name === 'SequelizeValidationError') {
								res.send({
									status: Status.FAILED,
									desc: 'ValidationError',
									error: err.errors,
									msg: '您的注册信息不符合要求'
								});
							} else {
								res.send({
									status: Status.FAILED,
									desc: 'internal error.',
									msg: '内部错误'
								});
							}
						});
				}
			});
	},
	//===========================================================================================
	//
	//   ####    ###    #####   ######   ####  ##   ##    ###
	//  ##      ## ##   ##  ##    ##    ##     ##   ##   ## ##
	//  ##     ##   ##  #####     ##    ##     #######  ##   ##
	//  ##     #######  ##        ##    ##     ##   ##  #######
	//   ####  ##   ##  ##        ##     ####  ##   ##  ##   ##
	//
	//===========================================================================================

	/**
	 *
	 *
	 * @param {*} req
	 * @param {*} res
	 */
	captcha: (req, res) => {
		const captcha = svgCaptcha.createMathExpr({
			size: 6,
			color: true,
			noise: 4,
			mathMax: 101,
			mathMin: -16,
			mathOperator: '+/-'
		});
		req.session.captcha = captcha.text;
		log.debug(`captcha generated:[${captcha.text}]`);
		res.type('svg')
			.status(200)
			.send(captcha.data);
	},
	//==================================================
	//                                                  
	//   ####  ##   ####    ##     ##  ##  ##     ##  
	//  ##     ##  ##       ####   ##  ##  ####   ##  
	//   ###   ##  ##  ###  ##  ## ##  ##  ##  ## ##  
	//     ##  ##  ##   ##  ##    ###  ##  ##    ###  
	//  ####   ##   ####    ##     ##  ##  ##     ##  
	//                                                  
	//==================================================

	signin: (req, res) => {
		// 验证码限制?
		const params = url.parse(req.url, true).query;
		const nickname = params.nickname || null;
		const emailAddr = params.emailAddr || null;
		const passwordHash = params.passwordHash || null;
		if (
			!passwordHash ||
			!(emailAddr || nickname)
		) {
			log.debug('invalid request for signin');
			res.send({
				status: Status.FAILED,
				desc: 'param needed',
				msg: '请输入完整的用户名/邮箱 和 密码'
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
					],
					password_hash: passwordHash
				}
			})

			.then((user) => {
				if (user) {
					req.session.user = user;
					req.session.isvalid = true;
					res.send({
						status: Status.OK,
						msg: '登陆成功'
					});
					return;
				} else {
					res.send({
						status: Status.FAILED,
						disc: 'signin info incorrect',
						msg: '密码错误'
					});
					return;
				}
			})
			.catch((err) => {
				if (err) {
					log.warn({
						error: err
					});
					res.send({
						status: Status.FAILED,
						error: err
					});
					return;
				}
			});
	}
};

module.exports = services;