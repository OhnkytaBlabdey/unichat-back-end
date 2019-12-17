'use-strict';

const url = require('url');

const log = require('../logger');
const Status = require('../status');
const Channel = require('../db/po/channel_model');
const CIG = require('../db/po/channel_in_group_model');

const createChannel = (req, res) => {
	log.debug('create channel requested.');
	if (!req.session.isvalid) {
		res.send({
			msg: '您未登录',
			status: Status.UNAUTHORIZED
		});
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
	const channelName = params.channelName || null;
	const channelStrategy = params.channelStrategy || null;
	const gid = params.gid || null;
	Channel.create({
		name: channelName,
		strategy: channelStrategy
	}).then((channel) => {
		log.debug('created', channel);
		CIG.create({
			channel_id: channel.id,
			group_id: gid
		}).then((cig) => {
			log.debug('created', cig);
			res.send({
				status: Status.OK
			});
		}).catch((err) => {
			if (err) {
				log.warn(err);
				res.send({
					status: Status.FAILED
				});
			}
		});
	}).catch((err) => {
		if (err) {
			log.warn(err);
			res.send({
				status: Status.FAILED
			});
		}
	});
};

module.exports = createChannel;