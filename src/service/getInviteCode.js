'use-strict';

const url = require('url');
const stringRandom = require('string-random');

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
	const params = url.parse(req.url, true).query || req.body;
	const uid = params.uid || null;
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
			attributes: ['updatedAt'],
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
			// TODO 时间戳转Date
			const dist = group.dataValues.updatedAt.getDay() - new Date().getDay();
			// const dist = 8;
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
							desc: {
								inviteCode: code
							},
							msg: 'ok',
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