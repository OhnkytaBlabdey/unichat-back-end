'use-strict';

const log = require('../logger');
const Status = require('../status');

const Limit = (req, res, next) => {
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
			desc: 'you access this app too frequently',
			msg: 'だが断る',
			status: Status.FAILED
		});
		return;
	} else if (req.session.lastAccess) {
		log.debug(`访问的间隔 ${lastAccess.getTime() - req.session.lastAccess}`);
	}
	req.session.lastAccess = lastAccess.getTime();
	next();
};

module.exports = Limit;