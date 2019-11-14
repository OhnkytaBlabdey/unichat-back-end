'use-strict';

const crypto = require('crypto');

const getUid = (maxid) => {
	const shift = 4;
	let buf = crypto.randomBytes(shift);
	return (new Date().getTimezoneOffset() + 1) * (1 << shift * 4) +
		(
			(parseInt(buf.toString('hex')) & ((1 << (2 * shift)) - 1)) <<
			(2 * shift)
		) +
		maxid;
};

module.exports = getUid;