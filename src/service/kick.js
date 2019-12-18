'use-strict';


const errorHandler = require('../util/handleInternalError');
const log = require('../logger');
const loginHandler = require('../util/handleLogin');
const sendMsg = require('../util/sendMsg');
const Status = require('../status');
const UIG = require('../db/po/user_in_group_model');
/**
 *
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
const Kick = (req, res) => {
	log.debug('kick user requested.');
	if (!loginHandler(req, res)) return;
	const params = req.para;
	const gid = params.gid || null;
	const kickee = params.uid || null;
	const kicker = req.session.user.uid || null;
	if (!gid || !kickee || !kicker) {
		res.send({
			desc: 'parameters needed',
			msg: 'failed',
			status: Status.FAILED
		});
	}
	UIG.count({
		attributes: ['role'],
		where: {
			gid: gid,
			role: 'owner',
			uid: kicker
		}
	}).then((ct) => {
		if (ct || (kicker === kickee)) {
			UIG.destroy({
				where: {
					gid: gid,
					uid: kickee
				}
			}).then((ct) => {
				if (ct) {
					sendMsg(res, Status.OK,
						'踢出成功', 'deleted');
				} else {
					sendMsg(res, Status.FAILED,
						'无法踢出', 'not deleted');
				}
			}).catch((err) => {
				errorHandler(res, err, 'kick 1');
			});
		}
	}).catch((err) => {
		errorHandler(res, err, 'kick 2');
	});

	return;
};

module.exports = Kick;