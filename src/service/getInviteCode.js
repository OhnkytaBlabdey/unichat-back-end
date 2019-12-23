'use-strict';

const moment = require('moment');
const stringRandom = require('string-random');

const connection = require('../db/config');
const Sequelize = require('sequelize');
const models = require('../db/po/models');

const errorHandler = require('../util/handleInternalError');
const log = require('../logger');
const loginHandler = require('../util/handleLogin');
const sendMsg = require('../util/sendMsg');
const Status = require('../status');
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
 * @author Ohnkyta <ohnkyta@163.com>
 * @public
 * @example /getInviteCode
 * @param {Request} req
 * @param {Response} res
 * @param {Number} gid
 * @returns {OK|FAILED|UNAUTHORIZED} status
 * @returns {String} inviteCode
 */
const GetInviteCode = (req, res, gid) => {
	const uid = req.session.user.uid;
	models.userInGroup.count({
		where: {
			siteGid: gid,
			userUid: uid
		}
	}).catch((err) => {
		errorHandler(res, err, 'get invite code 1');
	}).then((ct) => {
		if (!ct || ct != 1) {
			sendMsg(res, Status.UNAUTHORIZED,
				'未授权的请求');
			return;
		}
		models.group.findOne({
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
				models.group.update({
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
/**
 * @private
 * @param {Request} req
 * @param {Response} res
 */
const GetInviteCodeCB = (req, res) => {
	if (!loginHandler(req, res)) return;
	const params = req.para;
	const gid = params.gid || null;
	GetInviteCode(req, res, gid);
};

module.exports = GetInviteCodeCB;