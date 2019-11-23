'use-strict';

const url = require('url');
const stringRandom = require('string-random');

const log = require('../logger');
const Status = require('../status');
const getId = require('../util/uidGen');
const Group = require('../db/po/group_model');
const UserInGroup = require('../db/po/user_in_group_model');
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
const CreateGroup = (req, res) => {
	if (!req.session.isvalid) {
		res.send({
			desc: 'unauthorized action',
			msg: '未授权的请求',
			status: Status.UNAUTHORIZED
		});
		return;
	}
	const params = url.parse(req.url, true).query || req.body;
	const name = params.name;
	const logo = params.logo;
	Group.max('id').catch((err) => {
		if (err) {
			log.warn(err);
			res.send({
				desc: 'internal error',
				msg: '服务器内部错误',
				status: Status.FAILED
			});
			return;
		}
	}).then((maxid) => {
		if (!maxid) maxid = 0;
		const gid = getId(maxid);
		Group.create({
			gid: gid,
			invite_code: stringRandom(6),
			logo: logo,
			name: name
		}).catch((err) => {
			if (err) {
				log.warn(err);
				if (err.name === 'SequelizeValidationError') {
					res.send({
						desc: 'ValidationError',
						error: err.errors,
						msg: '群聊信息不符合要求',
						status: Status.FAILED
					});
				} else {
					res.send({
						desc: 'internal error.',
						msg: '内部错误',
						status: Status.FAILED
					});
				}
				return;
			}
		}).then((group) => {
			// TODO: 记录用户与群聊的关系
			UserInGroup.create({
				group_id: group.gid,
				role: 'owner',
				user_id: req.session.user.uid
			}).catch((err) => {
				if (err) {
					log.warn(err);
					res.send({
						desc: err,
						status: Status.FAILED
					});
				}
			}).then((uig) => {
				log.info(uig);
				res.send({
					desc: {
						gid: group.gid,
						logo: group.logo,
						name: group.name
					},
					msg: '创建群聊成功',
					status: Status.OK
				});
			});
		});
	});
};

module.exports = CreateGroup;