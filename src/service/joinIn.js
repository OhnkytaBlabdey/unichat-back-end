'use-strict';

const url = require('url');

const log = require('../logger');
const Status = require('../status');
const Group = require('../db/po/group_model');
const UIG = require('../db/po/user_in_group_model');

const JoinIn = (req, res) => {
	log.debug('join in requested.');
	if (!req.session.isvalid) {
		res.send({
			msg: '您未登录',
			status: Status.UNAUTHORIZED
		});
		return;
	}
	const params = url.parse(req.url, true).query || req.body;
	const inviteCode = params.inviteCode;
	Group.findOne({
		attributes: ['gid'],
		where: {
			invite_code: inviteCode
		}
	}).catch((err) => {
		if (err) {
			log.warn('not found group with this invite code', inviteCode, err);
			res.end({
				msg: '邀请码无效',
				status: Status.FAILED
			});
			return;
		}
	}).then((group) => {
		log.info('found group with invite code');
		// TODO 判断用户是否已经在群聊中
		UIG.count({
			where: {
				group_id: group.gid,
				user_id: req.session.uid
			}
		}).then((ct) => {
			if (ct > 0) {
				log.info('user already in group');
				res.send({
					msg: '您已经是群成员',
					status: Status.FAILED
				});
				return;
			}
			UIG.create({
				group_id: group.gid,
				role: 'normal',
				user_id: req.session.user.uid
			}).catch((err) => {
				if (err) {
					log.warn('join in group failed.', err);
					res.send({
						msg: '加入群聊失败',
						status: Status.FAILED
					});
				}
			}).then((uig) => {
				log.info('user joined group', uig);
				res.send({
					msg: '加入成功',
					status: Status.OK
				});
			});
		}).catch((err)=>{
			log.warn('count uig', err);
			res.send({
				msg:'internal error',
				status:Status.FAILED
			});
		});
	});
};

module.exports = JoinIn;