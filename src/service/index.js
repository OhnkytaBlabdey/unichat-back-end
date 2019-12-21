'use-strict';

const sendMsg = require('../util/sendMsg');
const Status = require('../status');
//============================================
//                                            
//  ##  ##     ##  ####    #####  ##    ##  
//  ##  ####   ##  ##  ##  ##      ##  ##   
//  ##  ##  ## ##  ##  ##  #####    ####    
//  ##  ##    ###  ##  ##  ##      ##  ##   
//  ##  ##     ##  ####    #####  ##    ##  
//                                            
//============================================
/**
 * 根路径
 * 没啥用
 * @example /
 * @param {Request} req
 * @param {Response} res
 */
const Index = (req, res) => {
	sendMsg(res, Status.OK,
		'这是UNICHAT的后台', null, 'hello');
};

module.exports = Index;