'use-strict';

const url = require('url');

const log = require('../logger');
const sendMsg = require('./sendMsg');
const Status = require('../status');
/**
 *
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const Limit = (req, res, next) => {
	let frequency = 0;
	if (req.session.isvalid) {
		frequency = 1000 / 8;
	} else {
		frequency = 1000 * 1;
	}

	if (!req.session.limit) {
		req.session.limit = {};
	}
	const path = url.parse(req.url, true).pathname;
	const lastAccess = new Date();
	if (req.session.limit[path] && (lastAccess.getTime() - req.session.limit[path]) < frequency) {
		req.session.limit[path] = lastAccess.getTime();
		sendMsg(res, Status.FAILED,
			'だが断る', 'you access this app too frequently');
		return;
	} else if (req.session.limit[path]) {
		log.debug('访问的间隔');
		log.debug(lastAccess.getTime() - req.session.limit[path]);
	}
	req.session.limit[path] = lastAccess.getTime();
	next();
};

module.exports = Limit;