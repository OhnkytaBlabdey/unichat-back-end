'use-strict';


const errorHandler = require('../util/handleInternalError');
const log = require('../logger');
const loginHandler = require('../util/handleLogin');
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
 * @author Ohnkyta <ohnkyta@163.com>
 * @public
 * @example /modify
 * @param {Request} req
 * @param {Response} res
 * @param {avatar|emailAddr|nickname|profile} colName 要修改的属性
 * @param {String} newVal 修改后的新值
 * @returns {OK|FAILED|UNAUTHORIZED} status
 * @returns {Map} {k,v} 一个键值对，修改成功的结果
 */
const Modify = (req, res, colName, newVal) => {
	// 只能修改 【昵称 邮箱地址 头像、签名档】
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
			errorHandler(res, err, 'modify');
		}).then((matched) => {
			log.info(`matched user: ${matched}`);
			sendMsg(res, Status.OK,
				'修改成功', null, kv);
		});
	}
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
	const colName = params.colName;
	const newVal = params.newVal;
	Modify(req, res, colName, newVal);
};

module.exports = ModifyCB;