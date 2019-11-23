'use-strict';

const svgCaptcha = require('svg-captcha');

const log = require('../logger');

//===========================================================================================
//
//   ####    ###    #####   ######   ####  ##   ##    ###
//  ##      ## ##   ##  ##    ##    ##     ##   ##   ## ##
//  ##     ##   ##  #####     ##    ##     #######  ##   ##
//  ##     #######  ##        ##    ##     ##   ##  #######
//   ####  ##   ##  ##        ##     ####  ##   ##  ##   ##
//
//===========================================================================================
/**
 * 验证码服务
 * 前提：请求不可以过于频繁
 * 结果：在请求者的session里记录验证码的文本，把图像发送给请求者
 *
 * @param {*} req
 * @param {*} res
 */
const Captcha = (req, res) => {
	const captcha = svgCaptcha.createMathExpr({
		size: 6,
		color: true,
		noise: 4,
		mathMax: 101,
		mathMin: -16,
		mathOperator: '+/-'
	});
	if (!req.session) {
		log.warn('session not created');
	}
	req.session.captcha = captcha.text;
	log.debug(req.session);
	log.debug(`captcha generated:[${captcha.text}]`);
	if (!req.session.captcha) {
		log.warn('session has no attribute captcha', req.session);
	}
	res.type('svg')
		.status(200)
		.send(captcha.data);
};

module.exports = Captcha;