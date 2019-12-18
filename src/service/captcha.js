'use-strict';

const svgCaptcha = require('svg-captcha');
const trekCaptcha = require('trek-captcha');


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
 * @param {Request} req
 * @param {Response} res
 */
const useSvg = false;
const Captcha = async (req, res) => {
	if (useSvg) {
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
		res.type('svg')
			.status(200)
			.send(captcha.data);
	} else {
		const captcha = await trekCaptcha({
			size: 2
		});
		req.session.captcha = captcha.token;
		log.debug(req.session);
		log.debug('captcha generated:', captcha.token);
		if (!req.session.captcha) {
			log.warn('session has no attribute captcha', req.session);
		}
		res.type('image/gif')
			.status(200)
			.send(captcha.buffer);
	}
};

module.exports = Captcha;