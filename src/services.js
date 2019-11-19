'use-strict';
const log = require('./logger');
const User = require('./db/po/user_model');
const Group = require('./db/po/group_model');
const UserInGroup = require('./db/po/user_in_group_model');
const getId = require('./util/uidGen');
const Status = require('./status');
const url = require('url');
const svgCaptcha = require('svg-captcha');
const crypto = require('crypto');
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
	 * 用户注册
	 * 前提：用户输入正确的字段信息，符合约束，验证码正确
	 * 结果：在库里添加用户记录，告诉用户注册成功，以及分配的uid
	 * @param {*} req
	 * @param {*} res
	 * @returns
	 */
	signup: (req, res) => {
		const params = (req.methed == 'GET') && url.parse(req.url, true).query || req.body;
		log.info(`signup request ${JSON.stringify(params)}`);
		let result = {};
		const nickname = params.nickname;
		const password = params.password;
		const emailAddr = params.emailAddr;
		const profile = params.profile || 'this guy has no profile';
		const avatarUrl = 'https://i.loli.net/';
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
		}).catch((err) => {
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
							status: Status.FAILED,
							msg: 'internal error'
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
						nickname: nickname,
						password_hash: passwordHash,
						email_addr: emailAddr,
						profile: profile,
						uid: uid,
						avatar: avatarUrl
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
	 * 验证码服务
	 * 前提：请求不可以过于频繁
	 * 结果：在请求者的session里记录验证码的文本，把图像发送给请求者
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
	/**
	 * 用户登录
	 * 前提：用户在数据库内有注册记录
	 * 前提：用户输入正确的用户名/邮箱地址、密码hash、验证码
	 * 结果：在session中保存用户的登录信息
	 * @param {*} req
	 * @param {*} res
	 * @returns
	 */
	signin: (req, res) => {
		// 验证码限制
		if (!req.session.captcha) {
			res.send({
				status: Status.UNAUTHORIZED,
				desc: 'invalid captcha',
				msg: '请输入正确的验证码'
			});
			return;
		}
		// 解析请求
		const params = (req.methed == 'GET') && url.parse(req.url, true).query || req.body;
		const nickname = params.nickname || null;
		const emailAddr = params.emailAddr || null;
		const passwordHash = params.passwordHash || null;
		const captcha = params.captcha || null;
		if (captcha != req.session.captcha) {
			res.send({
				status: Status.UNAUTHORIZED,
				desc: 'wrong captcha',
				msg: '验证码错误'
			});
			req.session.captcha = null;
			return;
		}
		req.session.captcha = null;
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
				]
				// password_hash: passwordHash
			}
		}).catch((err) => {
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
		}).then((user) => {
			if (user) {
				const hash1 = crypto.createHash('sha256').digest((user.password_hash + captcha));
				const hash2 = crypto.createHash('sha256').digest(passwordHash + captcha);
				const isvalid = hash1 === hash2;
				if (!isvalid) {
					res.send({
						status: Status.FAILED,
						desc: 'login failed',
						msg: '登录失败'
					});
					return;
				}
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
					disc: 'signin failed',
					msg: '登录失败'
				});
				return;
			}
		});
	},
	//============================================
	//                                            
	//  ##  ##     ##  ####    #####  ##    ##  
	//  ##  ####   ##  ##  ##  ##      ##  ##   
	//  ##  ##  ## ##  ##  ##  #####    ####    
	//  ##  ##    ###  ##  ##  ##      ##  ##   
	//  ##  ##     ##  ####    #####  ##    ##  
	//                                            
	//============================================
	/**
	 * 根路径
	 * 没啥用
	 * @param {*} req
	 * @param {*} res
	 */
	index: (req, res) => {
		res.send({
			status: Status.OK,
			desc: 'hello',
			msg: '这是UNICHAT的后台'
		});
	},
	//======================================================
	//                                                      
	//  ###    ###   #####   ####    ##  #####  ##    ##  
	//  ## #  # ##  ##   ##  ##  ##  ##  ##      ##  ##   
	//  ##  ##  ##  ##   ##  ##  ##  ##  #####    ####    
	//  ##      ##  ##   ##  ##  ##  ##  ##        ##     
	//  ##      ##   #####   ####    ##  ##        ##     
	//                                                      
	//======================================================
	/**
	 * 用户修改自己的属性
	 * 前提：用户已经登录
	 * 前提：修改后的字段符合约束
	 * 结果：修改该用户在库里的记录
	 * @param {*} req
	 * @param {*} res
	 */
	modify: (req, res) => {
		if (!req.session.isvalid || !req.session.user) {
			res.send({
				status: Status.UNAUTHORIZED,
				desc: 'you have not yet signed in',
				msg: 'だが断る'
			});
		}
		const params = (req.methed == 'GET') && url.parse(req.url, true).query || req.body;
		const colName = params.colName;
		const newVal = params.newVal;
		// 只能修改 【昵称 邮箱地址 头像】
		const availableCols = {
			nickname: 'nickname',
			emailAddr: 'email_addr',
			avatar: 'avatar',
			profile: 'profile'
		};
		let kv = {};
		kv[availableCols[colName]] = newVal;
		if (colName in availableCols) {
			// req.session.user = 
			User.update(kv, {
				where: {
					id: req.session.user.id
				},
				fields: [availableCols[colName]]
			}).catch((err) => {
				if (!err) return;
				log.warn(err);
				res.send({
					status: Status.FAILED,
					desc: err,
					msg: 'internal error'
				});
			}).then((matched) => {
				log.info(`matched user: ${matched}`);
				res.send({
					status: Status.OK,
					msg: '修改成功',
					desc: kv
				});
			});
		}
	},
	//=========================================================================================================
	//                                                                                                         
	//   ####  #####    #####    ###    ######  #####             ####    #####     #####   ##   ##  #####   
	//  ##     ##  ##   ##      ## ##     ##    ##               ##       ##  ##   ##   ##  ##   ##  ##  ##  
	//  ##     #####    #####  ##   ##    ##    #####            ##  ###  #####    ##   ##  ##   ##  #####   
	//  ##     ##  ##   ##     #######    ##    ##               ##   ##  ##  ##   ##   ##  ##   ##  ##      
	//   ####  ##   ##  #####  ##   ##    ##    #####  ########   ####    ##   ##   #####    #####   ##      
	//                                                                                                         
	/**
	 * 用户创建群聊
	 * 前提：用户已经登录
	 * 前提：群聊字段符合约束
	 * 结果：创建群聊记录，创建用户和群聊从属关系的记录，告诉用户分配的gid
	 * @param {*} req
	 * @param {*} res
	 */
	createGroup: (req, res) => {
		if (!req.session.isvalid) {
			res.send({
				status: Status.UNAUTHORIZED,
				desc: 'unauthorized action',
				msg: '未授权的请求'
			});
		}
		const params = (req.methed == 'GET') && url.parse(req.url, true).query || req.body;
		const name = params.name;
		const logo = params.logo;
		Group.max('id').catch((err) => {
			if (err) {
				log.warn(err);
				res.send({
					status: Status.FAILED,
					desc: 'internal error',
					msg: '服务器内部错误'
				});
			}
		}).then((maxid) => {
			if (!maxid) maxid = 0;
			const gid = getId(maxid);
			Group.create({
				name: name,
				logo: logo,
				gid: gid
			}).catch((err) => {
				if (err) {
					log.warn(err);
				} else {
					return;
				}
				if (err.name === 'SequelizeValidationError') {
					res.send({
						status: Status.FAILED,
						desc: 'ValidationError',
						error: err.errors,
						msg: '群聊信息不符合要求'
					});
				} else {
					res.send({
						status: Status.FAILED,
						desc: 'internal error.',
						msg: '内部错误'
					});
				}
			}).then((group) => {
				// TODO: 记录用户与群聊的关系
				UserInGroup.create({
					group_id: group.id,
					user_id: req.session.user.id,
					role: 'owner'
				}).catch((err) => {
					if (err) {
						log.warn(err);
						res.send({
							status: Status.FAILED,
							desc: err
						});
					}
				}).then((uig) => {
					log.info(uig);
					res.send({
						status: Status.OK,
						desc: {
							name: group.name,
							gid: group.gid,
							logo: group.logo
						},
						msg: '创建群聊成功'
					});
				});
			});
		});
	}
};

module.exports = services;