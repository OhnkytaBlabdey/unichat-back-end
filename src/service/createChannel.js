'use-strict';

const url = require('url');

const Channel = require('../db/po/channel_model');
const CIG = require('../db/po/channel_in_group_model');
const log = require('../logger');
const sendMsg = require('../util/sendMsg');
const Status = require('../status');
//=======================================================================================================================
//                                                                                                                       
//   ####  #####    #####    ###    ######  #####   ####  ##   ##    ###    ##     ##  ##     ##  #####  ##            
//  ##     ##  ##   ##      ## ##     ##    ##     ##     ##   ##   ## ##   ####   ##  ####   ##  ##     ##            
//  ##     #####    #####  ##   ##    ##    #####  ##     #######  ##   ##  ##  ## ##  ##  ## ##  #####  ##            
//  ##     ##  ##   ##     #######    ##    ##     ##     ##   ##  #######  ##    ###  ##    ###  ##     ##            
//   ####  ##   ##  #####  ##   ##    ##    #####   ####  ##   ##  ##   ##  ##     ##  ##     ##  #####  ######        
//                                                                                                                       
//=======================================================================================================================
/**
 *
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
const createChannel = (req, res) => {
	log.debug('create channel requested.');
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
	const channelName = params.channelName || null;
	const channelStrategy = params.channelStrategy || null;
	const gid = params.gid || null;
	Channel.create({
		name: channelName,
		strategy: channelStrategy
	}).then((channel) => {
		log.debug('created', channel);
		CIG.create({
			channel_id: channel.id,
			group_id: gid
		}).then((cig) => {
			log.debug('created', cig);
			sendMsg(res, Status.OK, '创建成功');
		}).catch((err) => {
			if (err) {
				log.warn(err);
				res.status(500);
				sendMsg(res, Status.FAILED,
					'内部错误', 'internal error');
			}
		});
	}).catch((err) => {
		if (err) {
			log.warn(err);
			res.send({
				status: Status.FAILED
			});
		}
	});
};

module.exports = createChannel;