'use-strict';

const url = require('url');

const log = require('../logger');
const sendMsg = require('../util/sendMsg');
const Status = require('../status');
const UIG = require('../db/po/user_in_group_model');

//=========================================================================
//                                                                         
//   ####    #####  ######  ##   ##   ####  #####  #####     ####        
//  ##       ##       ##    ##   ##  ##     ##     ##  ##   ##           
//  ##  ###  #####    ##    ##   ##   ###   #####  #####     ###         
//  ##   ##  ##       ##    ##   ##     ##  ##     ##  ##      ##        
//   ####    #####    ##     #####   ####   #####  ##   ##  ####         
//                                                                         
//=========================================================================

/**
 *
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
const getUsers = (req, res) => {
	log.debug('get users in group requested.');
	if (!req.session.isvalid) {
		sendMsg(res, Status.UNAUTHORIZED,
			'您没有登录');
		return;
	}
	let params = null;
	log.info(req.method);
	if (req.method === 'GET') {
		params = url.parse(req.url, true).query;
	}
	if (req.method === 'POST') {
		params = req.body;
	}
	const gid = params.gid || null;
	UIG.findAll({
		attributes: ['user_id'],
		where: {
			group_id: gid
		}
	}).then((uigs) => {
		log.debug('found users in group');
		res.send({
			status: Status.OK,
			users: uigs.map((uig) => {
				return uig.user_id;
			})
		});
	}).catch((err) => {
		if (err) {
			log.warn(err);
			res.status(500);
			sendMsg(res, Status.FAILED,
				'内部错误', 'internal error');
		}
	});
};

module.exports = getUsers;