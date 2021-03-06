'use-strict';

const stringRandom = require('string-random');

const connection = require('../db/config');
const Sequelize = require('sequelize');
const model = require('../db/po/models');

const errorHandler = require('../util/handleInternalError');
const getId = require('../util/uidGen');
const log = require('../logger');
const loginHandler = require('../util/handleLogin');
const sendMsg = require('../util/sendMsg');
const Status = require('../status');

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
 * @author Ohnkyta <ohnkyta@163.com>
 * @public
 * @example /createGroup
 * @param {Request} req
 * @param {Response} res
 * @param {String} name
 * @param {URL} logo
 * @returns {OK|FAILED|UNAUTHORIZED} status
 */
const CreateGroup = (req, res, name, logo) => {
	model.group.max('id').catch((err) => {
		if (err) {
			errorHandler(res, err, 'create group 1');
		}
	}).then((maxid) => {
		if (!maxid) maxid = 0;
		const gid = getId(maxid);
		model.group.create({
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
			const user = model.user.build(req.session.user);
			if (!group.addUser || !user.uid) {
				errorHandler(res, new Error('没有'), 'create group 4');
				return;
			}
			log.debug(user);
			group.addUser(user, {
				through: {
					role: 'owner'
				}
			}).catch((err) => {
				if (errorHandler(res, err, 'create group 3'))
					return;
			}).then((rs) => {
				if (rs) {
					log.info(rs);
					sendMsg(res, Status.OK,
						'创建群聊成功', null, {
							gid: group.gid,
							logo: group.logo,
							name: group.name
						});
				}
			});
		});
	});
};
/**
 * 用户创建群聊
 * 前提：用户已经登录
 * 前提：群聊字段符合约束
 * 结果：创建群聊记录，创建用户和群聊从属关系的记录，告诉用户分配的gid
 * @private
 * @param {Request} req
 * @param {Response} res
 */
const CreateGroupCB = (req, res) => {
	if (!loginHandler(req, res)) return;
	const params = req.para;
	const name = params.name;
	const logo = params.logo;
	CreateGroup(req, res, name, logo);
};

module.exports = CreateGroupCB;