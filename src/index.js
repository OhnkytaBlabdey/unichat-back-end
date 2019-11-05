'use-strict';

const https = require('https');
const log = require('./logger');
const fs = require('fs');
const url = require('url');
const services = require('./services');

const serverPort = 7890;

const server = https.createServer({
	key: fs.readFileSync('privatekey.pem'),
	cert: fs.readFileSync('certificate.pem'),
	ca: fs.readFileSync('certrequest.csr')
}, (req, res) => {
	log.info(`received request ${req.rawHeaders}`);
	log.info(` from client ${JSON.stringify(req.headers)}.`);
	log.info(`request url :${JSON.stringify(req.url)}`);
	const parsed = url.parse(req.url, true);
	log.info(`parsed :${JSON.stringify(parsed)}`);
	// 去掉开头的'/'
	const pathname = parsed.pathname.substr(1);
	const query = parsed.query;
	const serv = services[pathname];
	if (serv) {
		serv(query);
	}

	// response
	res.writeHead(200, {
		'Content-Type': 'application/json; charset=utf8'
	});
	res.write(JSON.stringify({
		desc: 'this is a test.',
		usrReq: parsed
	}), (err) => {
		if (err) log.warn(err);
	});
	res.end();
	log.info('response ended.');
});
log.info('server created.');
server.listen(serverPort);
module.exports = server;