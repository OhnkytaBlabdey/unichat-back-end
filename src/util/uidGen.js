'use-strict';

const crypto = require('crypto');
const log = require('../logger');
const getId = (maxid) => {
	const shift = 4;
	let buf = crypto.randomBytes(shift);
	const id = (Math.abs(new Date().getTimezoneOffset()) + 1) * (1 << (shift * 4)) +
		(
			(parseInt(buf.toString('hex')) & ((1 << (2 * shift)) - 1)) <<
			(2 * shift)
		) +
		maxid;
	log.info(`gen id:${id}`);
	return id;
};

module.exports = getId;