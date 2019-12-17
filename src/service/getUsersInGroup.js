'use-strict';

const url = require('url');

const log = require('../logger');
const Status = require('../status');
const UIG = require('../db/po/user_in_group_model');

const getUsers = (req, res) => {
	log.debug('get users in group requested.');
	if (!req.session.isvalid) {
		res.send({
			msg: '您未登录',
			status: Status.UNAUTHORIZED
		});
		return;
	}
	const params = url.parse(req.url, true).query || req.body;
	const gid = params.gid || null;
	UIG.findAll({
		attributes: ['user_id'],
		where: {
			group_id: gid
		}
	}).then((uigs) => {
		log.debug('found users in group');
		res.send({
			status: Status.OK,
			users: uigs.map((uig) => {
				return uig.user_id;
			})
		});
	}).catch((err) => {
		if (err) {
			log.warn(err);
			res.send({
				desc: 'internal error',
				status: Status.FAILED
			});
		}
	});
};

module.exports = getUsers;