'use-strict';

const connection = require('../db/config');
const Sequelize = require('sequelize');
const models = require('../db/po/models');

const loginHandler = require('../util/handleLogin');
const errorHandler = require('../util/handleInternalError');
const sendMsg = require('../util/sendMsg');
const Status = require('../status');
//=========================================================================
//                                                                         
//  ##   ##   ####  #####  #####    ##  ##     ##  #####   #####         
//  ##   ##  ##     ##     ##  ##   ##  ####   ##  ##     ##   ##        
//  ##   ##   ###   #####  #####    ##  ##  ## ##  #####  ##   ##        
//  ##   ##     ##  ##     ##  ##   ##  ##    ###  ##     ##   ##        
//   #####   ####   #####  ##   ##  ##  ##     ##  ##      #####         
//                                                                         
//=========================================================================

/**
 * 查询用户的头像、昵称、签名档
 * @author Ohnkyta <ohnkyta@163.com>
 * @public
 * @example /userInfo
 * @param {Request} req 请求
 * @param {Response} res 响应
 * @param {Number} uid 用户ID
 * @returns {OK|FAILED|UNAUTHORIZED} status
 * @returns {URL} avatar 用户头像
 * @returns {String} nickname 用户昵称
 * @returns {String} profile 用户签名档
 */
const UserInfo = (req, res, uid) => {
	models.user.findOne({
		attributes: [
			'avatar',
			'email_addr',
			'nickname',
			'profile'
		],
		where: {
			uid: uid
		}
	}).then((user) => {
		if (user) {
			sendMsg(res, Status.OK, null, null, user);
		} else {
			sendMsg(res, Status.FAILED, '未找到用户');
		}
	}).catch((err) => {
		errorHandler(res, err, 'user info');
	});
};

const UserInfoCB = (req, res) => {
	if (!loginHandler(req, res)) return;
	const params = req.para;
	const uid = params.uid || null;
	UserInfo(req, res, uid);
};

module.exports = UserInfoCB;