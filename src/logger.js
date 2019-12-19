'use-strict';
const bunyan = require('bunyan');
const process = require('process');
const log = global.log = bunyan.createLogger({
	name: 'unichat-back-end',
	time: new Date().toString(),
	streams: [{
		level: 'info',
		stream: process.stdout // log INFO and above to stdout
	}, {
		count: 64, // keep copies
		level: 'info',
		path: './log/info/infos.log',
		period: '6h', // daily rotation : '1d'
		type: 'rotating-file'
	}, {
		count: 64,
		level: 'debug',
		path: './log/debug/debug.log',
		period: '8h',
		type: 'rotating-file'
	}, {
		count: 64,
		level: 'warn',
		path: './log/warn/warn.log',
		period: '1d',
		type: 'rotating-file'
	}]
});
module.exports = log;