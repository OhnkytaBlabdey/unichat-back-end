'use-strict';

const log = require('../logger');
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
	const captcha = req.para.captcha || null;
	if (!req.session.captcha ||
		!captcha ||
		captcha !== req.session.captcha
	) {
		log.debug(`captcha:${captcha}`);
		log.debug(`session.captcha:${req.session.captcha}`);
		sendMsg(res, Status.UNAUTHORIZED,
			'验证码错误', 'wrong captcha');
		req.session.captcha = null;
		return false;
	}
	if (captcha === req.session.captcha) {
		req.session.captcha = null;
		log.debug('correct captcha');
		return true;
	} else {
		req.session.captcha = null;
		return false;
	}
};
module.exports = Handler;