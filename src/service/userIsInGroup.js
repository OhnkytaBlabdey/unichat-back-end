'use-strict';

const connection = require('../db/config');
const Sequelize = require('sequelize');
const models = require('../db/po/models');

const errorHandler = require('../util/handleInternalError');
const loginHandler = require('../util/handleLogin');
const sendMsg = require('../util/sendMsg');
const Status = require('../status');
//================================================================================================================
//                                                                                                                
//  ##   ##   ####  #####  #####    ##   ####  ##  ##     ##   ####    #####     #####   ##   ##  #####         
//  ##   ##  ##     ##     ##  ##   ##  ##     ##  ####   ##  ##       ##  ##   ##   ##  ##   ##  ##  ##        
//  ##   ##   ###   #####  #####    ##   ###   ##  ##  ## ##  ##  ###  #####    ##   ##  ##   ##  #####         
//  ##   ##     ##  ##     ##  ##   ##     ##  ##  ##    ###  ##   ##  ##  ##   ##   ##  ##   ##  ##            
//   #####   ####   #####  ##   ##  ##  ####   ##  ##     ##   ####    ##   ##   #####    #####   ##            
//                                                                                                                
//================================================================================================================
/**
 *
 * @author Ohnkyta <ohnkyta@163.com>
 * @private
 * @example /isInGroup
 * @param {Request} req
 * @param {Response} res
 * @param {Number} gid
 * @returns {OK|FAILED|UNAUTHORIZED} status
 * @returns {Boolean} dat 表示该登录的用户是否在群里
 */
const UserIsInGroup = (req, res, gid) => {
	const uid = req.session.user.uid;
	models.userInGroup.count({
		where: {
			siteGid: gid,
			userUid: uid
		}
	}).then((ct) => {
		if (ct > 0) {
			sendMsg(res, Status.OK, '您在群里', null, true);
			return true;
		} else {
			sendMsg(res, Status.OK, '您不在该群里', null, false);
			return false;
		}
	}).catch((err) => {
		errorHandler(res, err, 'user is in group');
		return null;
	});
};

const UserIsInGroupCB = (req, res) => {
	if (!loginHandler(req, res)) return;
	const params = req.para;
	const gid = params.gid || null;
	if (!gid || !req.session.user) {
		sendMsg(res, Status.FAILED, '缺少参数');
	}
	if (!req.session.joinedIn) {
		req.session.joinedIn = [];
	}
	if (UserIsInGroup(req, res, gid)) {
		req.session.joinedIn.push(gid);
	} else {
		req.session.joinedIn.pop();
	}
};

module.exports = UserIsInGroupCB;