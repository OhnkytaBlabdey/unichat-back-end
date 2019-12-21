'use-strict';


const errorHandler = require('../util/handleInternalError');
const log = require('../logger');
const loginHandler = require('../util/handleLogin');
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
 * 获取群聊中所有的用户ID
 * @author Ohnkyta <ohnkyta@163.com>
 * @public
 * @example /getUsers
 * @param {Request} req 请求
 * @param {Response} res 响应
 * @param {Number} gid 群聊ID
 * @returns {OK|FAILED|UNAUTHORIZED} status
 * @returns {Array} users 群聊所有成员
 */
const GetUsersInGroup = (req, res, gid) => {
	// TODO:如果用户不是该群成员，则拒绝查询
	UIG.findAll({
		attributes: ['user_id'],
		where: {
			group_id: gid
		}
	}).then((uigs) => {
		log.debug('found users in group');
		sendMsg(res, Status.OK, null, null, {
			users: uigs.map((uig) => {
				return uig.user_id;
			})
		});
	}).catch((err) => {
		errorHandler(res, err, 'get users');
	});
};

/**
 *
 * @private
 * @param {Request} req
 * @param {Response} res
 */
const getUsers = (req, res) => {
	log.debug('get users in group requested.');
	if (!loginHandler(req, res)) return;
	const params = req.para;
	const gid = params.gid || null;
	GetUsersInGroup(req, res, gid);
};

module.exports = getUsers;