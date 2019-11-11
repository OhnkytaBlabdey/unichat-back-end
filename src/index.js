'use-strict';

const express = require('express');
const https = require('https');
const fs = require('fs');
const session = require('express-session');

const log = require('./logger');
const urlLog = require('./urlLog');
const router = require('./router');
const Status = require('./status');

const serverPort = 10010;

const app = express();


app.use(session({
		secret: 'yingyingying',
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: true,
			// httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 30 * 2 // 2 months
		}
	}))
	// 日志
	.use((req, res, next) => {
		urlLog(req);
		next();
	})
	// 限制频率
	.use((req, res, next) => {
		let frequency = 0;
		if (req.session.isvalid) {
			frequency = 1000 / 8;
		} else {
			frequency = 1000 * 2;
		}

		let lastAccess = new Date();
		if (req.session.lastAccess && (lastAccess.getTime() - req.session.lastAccess) < frequency) {
			req.session.lastAccess = lastAccess.getTime();
			res.send({
				status: Status.FAILED,
				desc: 'you access this app too frequently',
				msg: 'だが断る'
			});
			return;
		} else if (req.session.lastAccess) {
			log.debug(`访问的间隔 ${lastAccess.getTime() - req.session.lastAccess}`);
		}
		req.session.lastAccess = lastAccess.getTime();
		next();
	})
	.use('/', router);
const server = https.createServer({
		key: fs.readFileSync('privatekey.pem'),
		cert: fs.readFileSync('certificate.pem'),
		ca: fs.readFileSync('certrequest.csr')
	}, // 证书
	app
);
log.warn('server created.');
server.listen(serverPort);
module.exports = server;