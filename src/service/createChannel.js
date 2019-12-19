'use-strict';

const Channel = require('../db/po/channel_model');
const CIG = require('../db/po/channel_in_group_model');
const errorHandler = require('../util/handleInternalError');
const log = require('../logger');
const loginHandler = require('../util/handleLogin');
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
 * @author Ohnkyta <ohnkyta@163.com>
 * @public
 * @param {Request} req
 * @param {Response} res
 * @param {String4-20} channelName 频道名称
 * @param {admin_only|free_to_chat|bot_only} channelStrategy 频道发言策略
 * @param {Number} gid 群聊ID
 * @returns {OK|FAILED|UNAUTHORIZED} status
 */
const handleCreateChannel = (req, res, channelName, channelStrategy, gid) => {
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
			errorHandler(res, err, 'create channel 1');
		});
	}).catch((err) => {
		errorHandler(res, err, 'create channel 2');
	});
};
/**
 * @private
 * @param {Request} req
 * @param {Response} res
 */
const createChannel = (req, res) => {
	log.debug('create channel requested.');
	if (!loginHandler(req, res)) return;
	const params = req.para;
	const channelName = params.channelName || null;
	const channelStrategy = params.channelStrategy || null;
	const gid = params.gid || null;
	handleCreateChannel(req, res, channelName, channelStrategy, gid);
};

module.exports = createChannel;