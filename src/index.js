'use-strict';

const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const session = require('express-session');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

const log = require('./logger');
const urlLog = require('./util/urlLog');
const router = require('./router');
const Limit = require('./util/frequecyLimit');

const app = express();

const serverPort = 10010;

app
	// session
	.use(session({
		cookie: {
			// secure: true,
			// httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 30 * 2 // 2 months
		},
		resave: true,
		saveUninitialized: false,
		secret: 'yingyingying'
	}))
	// icon
	.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
	// 解析请求体
	.use(bodyParser.json()) // for parsing application/json
	.use(bodyParser.urlencoded({
		extended: false
	})) // for parsing application/x-www-form-urlencoded
	// 日志
	.use((req, res, next) => {
		urlLog(req);
		next();
	})
	// 限制频率
	.use(Limit)
	// 路由表
	.use('/', router);
// const server = http.createServer(
const useHttps = false;
let server = undefined;
if (useHttps) {
	server = https.createServer({
			ca: fs.readFileSync('certrequest.csr'),
			cert: fs.readFileSync('certificate.pem'),
			key: fs.readFileSync('privatekey.pem')
		}, // 证书
		app
	);
	log.warn('https server created.');
	server.listen(serverPort);
} else {
	server = http.createServer(
		app
	);
	log.warn('http server created.');
	server.listen(serverPort);
}
module.exports = server;