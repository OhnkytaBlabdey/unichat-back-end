'use-strict';

const log = require('../logger');
const sendMsg = require('./sendMsg');
const Status = require('../status');
/**
 *
 *
 * @param {Response} res
 * @param {Error} err
 * @param {string} [app='unknown']
 */
const Handler = (res, err, app = 'unknown') => {
	if (err) {
		log.warn(err, 'in app', app);
		// res.status(500);
		sendMsg(res, Status.FAILED,
			'内部错误', 'internal error');
	}
};
module.exports = Handler;