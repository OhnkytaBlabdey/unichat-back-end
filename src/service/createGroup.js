'use-strict';

const stringRandom = require('string-random');

const errorHandler = require('../util/handleInternalError');
const getId = require('../util/uidGen');
const Group = require('../db/po/group_model');
const log = require('../logger');
const loginHandler = require('../util/handleLogin');
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
	if (!loginHandler(req, res)) return;
	const params = req.para;
	const name = params.name;
	const logo = params.logo;
	Group.max('id').catch((err) => {
		if (err) {
			errorHandler(res, err, 'create group 1');
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
					errorHandler(res, err, 'create group 2');
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
				errorHandler(res, err, 'create group 3');
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