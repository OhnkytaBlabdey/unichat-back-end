'use-strict';

const moment = require('moment');
const stringRandom = require('string-random');
const url = require('url');

const Group = require('../db/po/group_model');
const log = require('../logger');
const sendMsg = require('../util/sendMsg');
const Status = require('../status');
const UserInGroup = require('../db/po/user_in_group_model');
//============================================================================================================
//                                                                                                            
//   ####    #####  ######  ##  ##     ##  ##   ##  ##  ######  #####   ####   #####   ####    #####        
//  ##       ##       ##    ##  ####   ##  ##   ##  ##    ##    ##     ##     ##   ##  ##  ##  ##           
//  ##  ###  #####    ##    ##  ##  ## ##  ##   ##  ##    ##    #####  ##     ##   ##  ##  ##  #####        
//  ##   ##  ##       ##    ##  ##    ###   ## ##   ##    ##    ##     ##     ##   ##  ##  ##  ##           
//   ####    #####    ##    ##  ##     ##    ###    ##    ##    #####   ####   #####   ####    #####        
//                                                                                                            
//============================================================================================================
/**
 *
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
const GetInviteCode = (req, res) => {
	if (!req.session.isvalid) {
		sendMsg(res, Status.UNAUTHORIZED,
			'您没有登录');
		return;
	}
	const uid = req.session.user.uid;
	let params = null;
	log.info(req.method);
	if (req.method === 'GET') {
		params = url.parse(req.url, true).query;
	}
	if (req.method === 'POST') {
		params = req.body;
	}
	const gid = params.gid || null;

	UserInGroup.count({
		where: {
			group_id: gid,
			user_id: uid
		}
	}).catch((err) => {
		if (err) {
			log.warn(err);
			res.status(500);
			sendMsg(res, Status.FAILED,
				'内部错误', 'internal error');
			return;
		}
	}).then((ct) => {
		if (!ct) {
			sendMsg(res, Status.UNAUTHORIZED,
				'未授权的请求');
			return;
		}
		Group.findOne({
			attributes: ['updatedAt', 'invite_code'],
			where: {
				gid: gid
			}
		}).catch((err) => {
			if (err) {
				log.warn(err);
				res.status(500);
				sendMsg(res, Status.FAILED,
					'内部错误', 'internal error');
				return;
			}
		}).then((group) => {
			if (!group) {
				res.status(500);
				sendMsg(res, Status.FAILED,
					'内部错误', 'internal error');
				return;
			}
			log.info('需要产生邀请的群聊', group.dataValues);
			log.info('时间戳', group.dataValues.updatedAt);
			// TODO 时间戳转Date
			// e.g. 2019-11-23T15:27:52.000Z
			const oldDate = moment(group.dataValues.updatedAt).toDate();
			const dist = ((new Date().getTime() - oldDate.getTime()) / (1000 * 60 * 60 * 24));
			// log.debug(new Date().getTime(), oldDate.getTime());
			// log.debug('diff', dist);
			if (dist > 7) {
				const code = (gid % 100) + stringRandom(4);
				Group.update({
					invite_code: code
				}, {
					fields: ['invite_code'],
					where: {
						gid: gid
					}
				}).catch((err) => {
					if (!err) return;
					log.warn(err);
					res.status(500);
					sendMsg(res, Status.FAILED,
						'内部错误', 'internal error');
				}).then((matched) => {
					if (matched) {
						sendMsg(res, Status.OK, null, null, {
							inviteCode: code
						});
					} else {
						res.status(500);
						sendMsg(res, Status.FAILED,
							'内部错误', 'internal error');
						return;
					}
				});
			} else {
				log.info('use old invite_code',
					group.dataValues.invite_code);
				sendMsg(res, Status.OK, null, null, {
					inviteCode: group.dataValues.invite_code
				});
			}
		}).catch((err) => {
			if (err) {
				log.warn(err);
				res.status(500);
				sendMsg(res, Status.FAILED,
					'内部错误', 'internal error');
				return;
			}
		});
	});
};

module.exports = GetInviteCode;