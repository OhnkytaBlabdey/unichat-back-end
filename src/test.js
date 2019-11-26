'use-strict';

const trekCaptcha = require('trek-captcha');

const fun = () => {
	trekCaptcha({
		size: 5,
		style: -1
	}).then((captcha) => {
		console.log(captcha.buffer, captcha.token);
	});
};

fun();