'use-strict';

// const log = require('../logger');
/**
 *
 *
 * @param {Response} res
 * @param {string} status
 * @param {string} msg
 * @param {string} err
 * @param {Object} dat
 */
const SendMsg = (res, status, msg, err = null, dat = null) => {
	res.send({
		dat: dat,
		err: err,
		msg: msg,
		status: status
	});
};

module.exports = SendMsg;