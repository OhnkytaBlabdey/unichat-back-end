'use-strict';

const crypto = require('crypto');

const getUid = (maxid) => {
	const shift = 16;
	let buf = crypto.randomBytes(Math.ceil(shift / 4));
	return maxid * (1 << shift) +
		((parseInt(buf.toString('hex')) + Date.valueOf(new Date())) & ((1 << shift) - 1));
};

module.exports = getUid;