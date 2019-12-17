'use-strict';

const url = require('url');

const log = require('../logger');
const sendMsg = require('../util/sendMsg');
const Status = require('../status');
const User = require('../db/po/user_model');

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
 * @param {Request} req
 * @param {Response} res
 */

const Modify = (req, res) => {
	if (!req.session.isvalid || !req.session.user) {
		sendMsg(res, Status.UNAUTHORIZED,
			'您没有登录', 'you have not yet signed in', 'だが断る');
	}
	let params = null;
	log.info(req.method);
	if (req.method === 'GET') {
		params = url.parse(req.url, true).query;
	}
	if (req.method === 'POST') {
		params = req.body;
	}
	const colName = params.colName;
	const newVal = params.newVal;
	// 只能修改 【昵称 邮箱地址 头像】
	const availableCols = {
		avatar: 'avatar',
		emailAddr: 'email_addr',
		nickname: 'nickname',
		profile: 'profile'
	};
	let kv = {};
	kv[availableCols[colName]] = newVal;
	if (colName in availableCols) {
		// req.session.user = 
		User.update(kv, {
			fields: [availableCols[colName]],
			where: {
				id: req.session.user.id
			}
		}).catch((err) => {
			if (!err) return;
			log.warn(err);
			res.status(500);
			sendMsg(res, Status.FAILED,
				'内部错误', 'internal error');
		}).then((matched) => {
			log.info(`matched user: ${matched}`);
			sendMsg(res, Status.OK,
				'修改成功', null, kv);
		});
	}
};

module.exports = Modify;