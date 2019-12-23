'use-strict';

const connection = require('../db/config');
const Sequelize = require('sequelize');
const models = require('../db/po/models');

const errorHandler = require('../util/handleInternalError');
const log = require('../logger');
const loginHandler = require('../util/handleLogin');
const sendMsg = require('../util/sendMsg');
const Status = require('../status');

//=====================================
//                                     
//  ##  ##  ##   ####  ##  ##        
//  ## ##   ##  ##     ## ##         
//  ####    ##  ##     ####          
//  ## ##   ##  ##     ## ##         
//  ##  ##  ##   ####  ##  ##        
//                                     
//=====================================

/**
 * @author Ohnkyta <ohnkyta@163.com>
 * @public
 * @example /kick
 * @param {Request} req
 * @param {Response} res
 * @param {Number} gid 群聊ID
 * @param {Number} kickee 被踢出者的用户ID
 * @returns {OK|FAILED|UNAUTHORIZED} status
 */
const Kick = (req, res, gid, kickee) => {
	const kicker = req.session.user.uid;
	if (!gid || !kickee || !kicker) {
		log.info(req.session.user.uid);
		log.info(kicker);
		log.info(kickee);
		log.info(gid);
		res.send({
			desc: 'parameters needed',
			msg: 'failed',
			status: Status.FAILED
		});
		return;
	}
	models.userInGroup.count({
		attributes: ['role'],
		where: {
			siteGid: gid,
			role: 'owner',
			userUid: kicker
		}
	}).then((ct) => {
		if ((ct > 0) || (kicker == kickee)) {
			models.userInGroup.destroy({
				where: {
					siteGid: gid,
					userUid: kickee
				}
			}).then((ct) => {
				if (ct) {
					sendMsg(res, Status.OK,
						'踢出成功', 'deleted');
				} else {
					sendMsg(res, Status.FAILED,
						'无法踢出', 'not deleted');
				}
			}).catch((err) => {
				errorHandler(res, err, 'kick 1');
			});
		} else {
			sendMsg(res, Status.FAILED,
				'无法踢出', 'not deleted');
		}
	}).catch((err) => {
		errorHandler(res, err, 'kick 2');
	});
};
/**
 *
 * @private
 * @param {Request} req
 * @param {Response} res
 */
const KickCB = (req, res) => {
	log.debug('kick user requested.');
	if (!loginHandler(req, res)) return;
	const params = req.para;
	const gid = params.gid || null;
	const kickee = params.kickee || null;
	Kick(req, res, gid, kickee);
};

module.exports = KickCB;