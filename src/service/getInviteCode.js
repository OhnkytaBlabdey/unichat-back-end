'use-strict';

const url = require('url');
const stringRandom = require('string-random');
const moment = require('moment');

const log = require('../logger');
const Status = require('../status');
const Group = require('../db/po/group_model');
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

const GetInviteCode = (req, res) => {
	if (!req.session.isvalid) {
		res.send({
			desc: 'unauthorized action',
			msg: '未授权的请求',
			status: Status.UNAUTHORIZED
		});
		return;
	}
	const uid = req.session.user.uid;
	const params = url.parse(req.url, true).query || req.body;
	const gid = params.gid || null;

	UserInGroup.count({
		where: {
			group_id: gid,
			user_id: uid
		}
	}).catch((err) => {
		if (err) {
			log.warn(err);
			res.send({
				desc: 'internal error',
				msg: '服务器内部错误',
				status: Status.FAILED
			});
			return;
		}
	}).then((ct) => {
		if (!ct) {
			res.send({
				desc: 'unauthorized action',
				msg: '未授权的请求',
				status: Status.UNAUTHORIZED
			});
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
				res.send({
					desc: 'internal error',
					msg: '服务器内部错误',
					status: Status.FAILED
				});
				return;
			}
		}).then((group) => {
			if (!group) {
				res.send({
					desc: 'internal error',
					msg: '服务器内部错误',
					status: Status.FAILED
				});
				return;
			}
			log.info('需要产生邀请的群聊', group.dataValues);
			log.info('时间戳', group.dataValues.updatedAt);
			// TODO 时间戳转Date
			// e.g. 2019-11-23T15:27:52.000Z
			const oldDate = moment(group.dataValues.updatedAt).toDate();
			const dist = ((new Date().getTime() - oldDate.getTime()) / (1000 * 60 * 60 * 24));
			log.debug(new Date().getTime(), oldDate.getTime());
			log.debug('diff', dist);
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
					res.send({
						desc: err,
						msg: 'internal error',
						status: Status.FAILED
					});
				}).then((matched) => {
					if (matched) {
						res.send({
							inviteCode: code,
							msg: 'get invite code ok',
							status: Status.OK
						});
					} else {
						res.send({
							desc: 'internal error',
							msg: '服务器内部错误',
							status: Status.FAILED
						});
						return;
					}
				});
			} else {
				log.info('use old invite_code', group.dataValues.invite_code);
				res.send({
					inviteCode: group.dataValues.invite_code,
					msg: 'get invite code ok',
					status: Status.OK
				});
			}
		}).catch((err) => {
			if (err) {
				res.send({
					desc: 'internal error',
					msg: '服务器内部错误',
					status: Status.FAILED
				});
				return;
			}
		});
	});
};

module.exports = GetInviteCode;