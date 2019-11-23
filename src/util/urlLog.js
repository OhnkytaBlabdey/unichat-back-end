'use-strict';

const url = require('url');

const log = require('../logger');

const commonLog = (req) => {
	log.debug(`received request ${req.rawHeaders}`);
	log.debug(` from client ${JSON.stringify(req.headers)}.`);
	log.debug(`request url :${JSON.stringify(req.url)}`);
	const parsed = url.parse(req.url, true);
	log.info(`parsed :${JSON.stringify(parsed)}`);
	// 去掉开头的'/'
	const pathname = parsed.pathname.substr(1);
	const query = parsed.query;
	// 解析请求
	const serv = {
		servName: pathname,
		params: query
	};
	log.info(`requested for service :${JSON.stringify(serv)}`);
	log.info('request body', req.body);
	log.info('request session', req.session);
	// // 返回解析的服务名称和参数
	// return serv;
};
module.exports = commonLog;