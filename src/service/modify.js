'use-strict';

const connection = require('../db/config');
const Sequelize = require('sequelize');
const models = require('../db/po/models');

const errorHandler = require('../util/handleInternalError');
const log = require('../logger');
const loginHandler = require('../util/handleLogin');
const sendMsg = require('../util/sendMsg');
const Status = require('../status');

//======================================================
//                                                      
//  ###    ###   #####   ####    ##  #####  ##    ##  
//  ## #  # ##  ##   ##  ##  ##  ##  ##      ##  ##   
//  ##  ##  ##  ##   ##  ##  ##  ##  #####    ####    
//  ##      ##  ##   ##  ##  ##  ##  ##        ##     
//  ##      ##   #####   ####    ##  ##        ##     
//                                                      
//======================================================
/**
 * 用户修改自己的属性
 * 前提：用户已经登录
 * 前提：修改后的字段符合约束
 * 结果：修改该用户在库里的记录
 * @author Ohnkyta <ohnkyta@163.com>
 * @public
 * @example /modify
 * @param {Request} req
 * @param {Response} res
 * @param {URL} avatar 新的头像图床链接
 * @param {email} emailAddr 新邮箱
 * @param {String} nickname 新昵称
 * @param {String} profile 新签名档
 * @returns {OK|FAILED|UNAUTHORIZED} status
 * @returns {Map} {k,v} 一个键值对，修改成功的结果
 */
const Modify = (req, res, avatar, emailAddr, nickname, profile) => {
	// 只能修改 【昵称 邮箱地址 头像、签名档】
	const kv = {
		avatar: avatar,
		email_addr: emailAddr,
		nickname: nickname,
		profile: profile
	};
	let m_fields = [];
	if (avatar) m_fields.push('avatar');
	if (nickname) m_fields.push('nickname');
	if (emailAddr) m_fields.push('email_addr');
	if (profile) m_fields.push('profile');
	if (m_fields.length == 0) {
		sendMsg(res, Status.FAILED, '缺少参数');
		return;
	}

	models.user.update(kv, {
		fields: m_fields,
		where: {
			id: req.session.user.id
		}
	}).catch((err) => {
		errorHandler(res, err, 'modify');
	}).then((matched) => {
		if (matched > 0) {
			log.info(`matched user: ${matched}`);
			sendMsg(res, Status.OK,
				'修改成功', null, {
					avatar: kv.avatar,
					nickname: kv.nickname,
					emailAddr: kv.email_addr,
					profile: kv.profile
				});
		} else {
			sendMsg(res, Status.FAILED, '修改失败');
		}
	});
};
/**
 * 用户修改自己的属性
 * 前提：用户已经登录
 * 前提：修改后的字段符合约束
 * 结果：修改该用户在库里的记录
 * @private
 * @param {Request} req
 * @param {Response} res
 */

const ModifyCB = (req, res) => {
	if (!loginHandler(req, res)) return;
	const params = req.para;
	const nickname = params.nickname;
	const emailAddr = params.emailAddr;
	const avatar = params.avatar;
	const profile = params.profile;
	Modify(req, res, avatar, emailAddr, nickname, profile);
};

module.exports = ModifyCB;