'use-strict';

const url = require('url');
const crypto = require('crypto');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

const log = require('./logger');
const User = require('./db/po/user_model');
const Group = require('./db/po/group_model');
const UserInGroup = require('./db/po/user_in_group_model');
const getId = require('./util/uidGen');
const Status = require('./status');

const signUp = require('./service/signUp');
const captcha = require('./service/captcha');

const services = {
	signup: signUp,
	captcha: captcha,
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
		const params = url.parse(req.url, true).query || req.body;
		const nickname = params.nickname || null;
		const emailAddr = params.emailAddr || null;
		const passwordHash = params.passwordHash || null;
		const captcha = params.captcha || null;
		if (captcha != req.session.captcha) {
			log.debug(`wrong captcha${captcha}`);
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
				const sha256 = crypto.createHash('sha256');
				sha256.update(user.password_hash + captcha);
				const hash = sha256.digest('hex');
				const isvalid = hash === passwordHash;
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