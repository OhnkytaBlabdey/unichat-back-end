'use-strict';

const https = require('https');
const log = require('./logger');
const fs = require('fs');
const serverPort = 7890;

const server = https.createServer({
	key: fs.readFileSync('privatekey.pem'),
	cert: fs.readFileSync('certificate.pem')
	// ca: fs.readFileSync('certrequest.csr')
}, (req, res) => {
	log.info(`received request ${req.rawHeaders}`);
	log.info(` from client ${JSON.stringify(req.headers)}.`);
	log.info(`request url :${JSON.stringify(req.url)}`);
	res.writeHead(200, {
		'Content-Type': 'application/json; charset=utf8'
	});
	res.write(JSON.stringify({
		desc: 'this is a test.',
		usrReq: JSON.stringify(req.url)
	}), (err) => {
		if (err) log.warn(err);
	});
	res.end();
});
log.info('server created.');
server.listen(serverPort);
module.exports = server;