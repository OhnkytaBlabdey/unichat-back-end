'use-strict';

const url = require('url');

const Status = require('../status');
const log = require('../logger');
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
 * @param {*} req
 * @param {*} res
 */

const Modify = (req, res) => {
	if (!req.session.isvalid || !req.session.user) {
		res.send({
			desc: 'you have not yet signed in',
			msg: 'だが断る',
			status: Status.UNAUTHORIZED
		});
	}
	const params = (req.methed == 'GET') && url.parse(req.url, true).query || req.body;
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
			res.send({
				desc: err,
				msg: 'internal error',
				status: Status.FAILED
			});
		}).then((matched) => {
			log.info(`matched user: ${matched}`);
			res.send({
				desc: kv,
				msg: '修改成功',
				status: Status.OK
			});
		});
	}
};

module.exports = Modify;