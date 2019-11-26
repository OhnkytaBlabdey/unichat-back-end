'use-strict';

const svgCaptcha = require('svg-captcha');
const {
	convert
} = require('convert-svg-to-png');

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
const Captcha = async (req, res) => {
	const captcha = svgCaptcha.createMathExpr({
		color: true,
		mathMax: 101,
		mathMin: -16,
		mathOperator: '+/-',
		noise: 4,
		size: 6
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
	const img = await convert(captcha.data);
	res.type('image/png')
		.status(200)
		.send(img);
};

module.exports = Captcha;