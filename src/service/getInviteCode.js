'use-strict';

const moment = require('moment');
const stringRandom = require('string-random');

const errorHandler = require('../util/handleInternalError');
const Group = require('../db/po/group_model');
const log = require('../logger');
const loginHandler = require('../util/handleLogin');
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
	if (!loginHandler(req, res)) return;
	const uid = req.session.user.uid;
	const params = req.para;
	const gid = params.gid || null;

	UserInGroup.count({
		where: {
			group_id: gid,
			user_id: uid
		}
	}).catch((err) => {
		errorHandler(res, err, 'get invite code 1');
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
			errorHandler(res, err, 'get invite code 2');
		}).then((group) => {
			if (!group) {
				errorHandler(res, Error('unknown'), 'get invite code 3');
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
					errorHandler(res, err, 'get invite code 4');
				}).then((matched) => {
					if (matched) {
						sendMsg(res, Status.OK, null, null, {
							inviteCode: code
						});
					} else {
						errorHandler(res, Error('unknown'), 'get invite code 5');
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
			errorHandler(res, err, 'get invite code 6');
		});
	});
};

module.exports = GetInviteCode;