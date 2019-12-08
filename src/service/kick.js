'use-strict';

const url = require('url');

const log = require('../logger');
const Status = require('../status');
const UIG = require('../db/po/user_in_group_model');

const Kick = (req, res) => {
	log.debug('kick user requested.');
	if (!req.session.isvalid) {
		res.send({
			msg: '您未登录',
			status: Status.UNAUTHORIZED
		});
		return;
	}
	const params = url.parse(req.url, true).query || req.body;
	const gid = params.gid || null;
	const kickee = params.uid || null;
	const kicker = req.session.user.uid || null;
	if (!gid || !kickee || !kicker) {
		res.send({
			desc: 'parameters needed',
			msg: 'failed',
			status: Status.FAILED
		});
	}
	UIG.count({
		attributes: ['role'],
		where: {
			gid: gid,
			role: 'owner',
			uid: kicker
		}
	}).then((ct) => {
		if (ct || (kicker === kickee)) {
			UIG.destroy({
				where: {
					gid: gid,
					uid: kickee
				}
			}).then((ct) => {
				if (ct) {
					res.send({
						desc: 'deleted',
						msg: '踢出成功',
						status: Status.OK
					});
				} else {
					res.send({
						desc: 'not deleted',
						msg: '无法踢出',
						status: Status.FAILED
					});
				}
			}).catch((err) => {
				log.warn('kick', err);
				res.send({
					desc: 'internal error',
					msg: '内部错误',
					status: Status.FAILED
				});
			});
		}
	}).catch((err) => {
		if (err) {
			log.warn('kick', err);
			res.send({
				desc: 'failed',
				msg: 'failed',
				status: Status.FAILED
			});
		}
	});

	return;
};

module.exports = Kick;