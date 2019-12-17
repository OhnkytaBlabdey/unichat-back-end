'use-strict';

const url = require('url');

const Group = require('../db/po/group_model');
const log = require('../logger');
const sendMsg = require('../util/sendMsg');
const Status = require('../status');
const UIG = require('../db/po/user_in_group_model');
/**
 *
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
const JoinIn = (req, res) => {
	log.debug('join in requested.');
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
	const inviteCode = params.inviteCode;
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
			log.warn('count uig', err);
			res.status(500);
			sendMsg(res, Status.FAILED,
				'内部错误', 'internal error');
		});
	});
};

module.exports = JoinIn;