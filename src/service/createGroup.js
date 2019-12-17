'use-strict';

const stringRandom = require('string-random');
const url = require('url');

const getId = require('../util/uidGen');
const Group = require('../db/po/group_model');
const log = require('../logger');
const sendMsg = require('../util/sendMsg');
const Status = require('../status');
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
 * @param {Request} req
 * @param {Response} res
 */
const CreateGroup = (req, res) => {
	if (!req.session.isvalid) {
		sendMsg(res, Status.UNAUTHORIZED,
			'您没有登录');
		return;
	}
	let params = null;
	log.info(req.method);
	if (req.method === 'GET') {
		params = url.parse(req.url, true).query;
	}
	if (req.method === 'POST') {
		params = req.body;
	}
	const name = params.name;
	const logo = params.logo;
	Group.max('id').catch((err) => {
		if (err) {
			log.warn(err);
			res.status(500);
			sendMsg(res, Status.FAILED,
				'内部错误', 'internal error');
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
					sendMsg(res, Status.FAILED,
						'群聊信息不符合要求',
						'ValidationError',
						err.errors);
				} else {
					res.status(500);
					sendMsg(res, Status.FAILED,
						'内部错误', 'internal error');
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
					res.status(500);
					sendMsg(res, Status.FAILED,
						'内部错误', 'internal err');
				}
			}).then((uig) => {
				log.info(uig);
				sendMsg(res, Status.OK,
					'创建群聊成功', null, {
						gid: group.gid,
						logo: group.logo,
						name: group.name
					});
			});
		});
	});
};

module.exports = CreateGroup;