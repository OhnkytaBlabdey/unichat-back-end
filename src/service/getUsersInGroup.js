'use-strict';

const connection = require('../db/config');
const Sequelize = require('sequelize');
const models = require('../db/po/models');

const errorHandler = require('../util/handleInternalError');
const log = require('../logger');
const loginHandler = require('../util/handleLogin');
const sendMsg = require('../util/sendMsg');
const Status = require('../status');

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
	models.group.findOne({
		include: [{
			model: models.user,
			attributes: [
				'uid', 'avatar', 'nickname', 'email_addr', 'profile'
			]
		}],
		where: {
			gid: gid
		}
	}).then((group) => {
		if (!group) {
			sendMsg(res, Status.UNAUTHORIZED, '不存在');
			return;
		}
		const user = models.user.build(req.session.user);
		const users = group.users;
		log.debug(users, typeof (users));
		for (const usr of users) {
			// 找到
			if (usr.uid === user.uid) {
				sendMsg(res, Status.OK, null, null, {
					users: users.map((userInSite) => {
						return {
							uid: userInSite.uid,
							avatar: userInSite.avatar,
							profile: userInSite.profile,
							emailAddr: userInSite.email_addr,
							nickname: userInSite.nickname
						};
					})
				});
				return;
			}
		}
		// 没有找到
		sendMsg(res, Status.UNAUTHORIZED, '您不在该群');
		return;
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