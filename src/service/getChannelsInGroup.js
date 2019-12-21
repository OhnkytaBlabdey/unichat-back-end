'use-strict';

const errorHandler = require('../util/handleInternalError');
const loginHandler = require('../util/handleLogin');
const sendMsg = require('../util/sendMsg');
const Status = require('../status');
const CIG = require('../db/po/channel_in_group_model');
//=================================================================================================================
//                                                                                                                 
//   ####    #####  ######             ####  ##   ##    ###    ##     ##  ##     ##  #####  ##       ####        
//  ##       ##       ##              ##     ##   ##   ## ##   ####   ##  ####   ##  ##     ##      ##           
//  ##  ###  #####    ##              ##     #######  ##   ##  ##  ## ##  ##  ## ##  #####  ##       ###         
//  ##   ##  ##       ##              ##     ##   ##  #######  ##    ###  ##    ###  ##     ##         ##        
//   ####    #####    ##    ########   ####  ##   ##  ##   ##  ##     ##  ##     ##  #####  ######  ####         
//                                                                                                                 
//=================================================================================================================
/**
 * 允许群成员查询该群的所有频道
 * @author Ohnkyta <ohnkyta@163.com>
 * @public
 * @example not completed
 * @param {Request} req
 * @param {Response} res
 * @param {Number} gid
 * @returns {OK|FAILED|UNAUTHORIZED} status
 * @returns {Array} channels
 */
const GetChannels = (req, res, gid) => {
	if (req.session.joinedIn && req.session.joinedIn.indexOf(gid) == -1) {
		//TODO 使用sequelize的关系模型，重构
		CIG.findAll({
			attributes: ['channel_id'],
			where: {
				group_id: gid
			}
		}).then((channels) => {
			sendMsg(res, Status.OK, null, null, {
				channels: channels
			});
		}).catch((err) => {
			errorHandler(res, err, 'get channels');
		});
	} else {
		sendMsg(res, Status.UNAUTHORIZED, '您不是该群成员');
	}
};

const GetChannelsCB = (req, res) => {
	if (!loginHandler(req, res)) return;
	const params = req.para;
	const gid = params.gid || null;
	// TODO 缺少参数的处理复用
	if (!gid) {
		sendMsg(res, Status.FAILED, '缺少参数');
	}
	GetChannels(req, res, gid);
};
module.exports = GetChannelsCB;