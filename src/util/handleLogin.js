'use-strict';

const sendMsg = require('./sendMsg');
const Status = require('../status');
/**
 *
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Boolean}
 */
const Handler = (req, res) => {
	if (!req.session || !req.session.isvalid) {
		sendMsg(res, Status.UNAUTHORIZED,
			'您没有登录');
		return false;
	}
	return true;
};
module.exports = Handler;