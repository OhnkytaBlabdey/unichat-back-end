"use-strict";
const bunyan = require('bunyan')
const process = require('process')
const log = global.log = bunyan.createLogger({
	name: "unichat-dbm",
	streams: [{
		level: 'info',
		stream: process.stdout // log INFO and above to stdout
	}, {
		level: 'info',
		type: 'rotating-file',
		path: './log/infos.log',
		period: '6h', // daily rotation : '1d'
		count: 64 // keep copies
	}]
})
module.exports = log