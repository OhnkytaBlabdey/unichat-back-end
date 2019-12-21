'use-strict';


const errorHandler = require('../util/handleInternalError');
const Group = require('../db/po/group_model');
const log = require('../logger');
const loginHandler = require('../util/handleLogin');
const sendMsg = require('../util/sendMsg');
const Status = require('../status');
const UIG = require('../db/po/user_in_group_model');
//=========================================================
//                                                         
//      ##   #####   ##  ##     ##  ##  ##     ##        
//      ##  ##   ##  ##  ####   ##  ##  ####   ##        
//      ##  ##   ##  ##  ##  ## ##  ##  ##  ## ##        
//  ##  ##  ##   ##  ##  ##    ###  ##  ##    ###        
//   ####    #####   ##  ##     ##  ##  ##     ##        
//                                                         
//=========================================================
/**
 * @author Ohnkyta <ohnkyta@163.com>
 * @public
 * @example /joinIn
 * @param {Request} req
 * @param {Response} res
 * @param {String} inviteCode 邀请码
 * @returns {OK|FAILED|UNAUTHORIZED} status
 */
const JoinIn = (req, res, inviteCode) => {
	Group.findOne({
		attributes: ['gid'],
		where: {
			invite_code: inviteCode
		}
	}).catch((err) => {
		if (err) {
			log.warn('not found group with this invite code', inviteCode, err);
			sendMsg(res, Status.FAILED,
				'邀请码无效', 'invalid intive code');
			return;
		}
	}).then((group) => {
		log.info('found group with invite code');
		// TODO 判断用户是否已经在群聊中
		UIG.count({
			where: {
				group_id: group.gid,
				user_id: req.session.user.uid
			}
		}).then((ct) => {
			if (ct > 0) {
				log.info('user already in group');
				sendMsg(res, Status.FAILED,
					'您已经是群成员', 'already in group');
				return;
			}
			UIG.create({
				group_id: group.gid,
				role: 'normal',
				user_id: req.session.user.uid
			}).catch((err) => {
				if (err) {
					log.warn('join in group failed.', err);
					sendMsg(res, Status.FAILED,
						'加入群聊失败', 'failed');
				}
			}).then((uig) => {
				log.info('user joined group', uig);
				sendMsg(res, Status.OK, '加入成功', null);
			});
		}).catch((err) => {
			errorHandler(res, err, 'count uig');
		});
	});
};

/**
 *
 * @private
 * @param {Request} req
 * @param {Response} res
 */
const JoinInCB = (req, res) => {
	log.debug('join in requested.');
	if (!loginHandler(req, res)) return;
	const params = req.para;
	const inviteCode = params.inviteCode;
	JoinIn(req, res, inviteCode);
};

module.exports = JoinInCB;