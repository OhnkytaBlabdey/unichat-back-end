'use-strict';

const url = require('url');

const log = require('../logger');
const sendMsg = require('../util/sendMsg');
const Status = require('../status');
const UIG = require('../db/po/user_in_group_model');

const Kick = (req, res) => {
	log.debug('kick user requested.');
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
					sendMsg(res, Status.OK,
						'踢出成功', 'deleted');
				} else {
					sendMsg(res, Status.FAILED,
						'无法踢出', 'not deleted');
				}
			}).catch((err) => {
				log.warn('kick', err);
				res.status(500);
				sendMsg(res, Status.FAILED,
					'内部错误', 'internal error');
			});
		}
	}).catch((err) => {
		if (err) {
			log.warn('kick', err);
			res.status(500);
			sendMsg(res, Status.FAILED,
				'内部错误', 'internal error');
		}
	});

	return;
};

module.exports = Kick;