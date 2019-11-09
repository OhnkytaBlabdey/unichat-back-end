'use-strict';

const express = require('express');
const https = require('https');
const log = require('./logger');
const fs = require('fs');
const urlLog = require('./urlLog');
const router = require('./router');
const serverPort = 10010;

const app = express();
const session = require('express-session');

app.use(session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: true
		}
	}))
	.use((req, res, next) => {
		urlLog(req);
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