'use-strict';

const url = require('url');

const log = require('../logger');
/**
 *
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const HandleParams = (req, res, next) => {
	if (req.method === 'GET') {
		req.para = url.parse(req.url, true).query;
	} else if (req.method === 'POST') {
		req.para = req.body;
	} else {
		log.info('invalid method');
		res.status(405);
		return;
	}
	log.info('parameters', req.para);
	next();
};

module.exports = HandleParams;