'use-strict';

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
 * @param {*} req
 * @param {*} res
 */
const Index = (req, res) => {
	res.send({
		desc: 'hello',
		msg: '这是UNICHAT的后台',
		status: Status.OK
	});
};

module.exports = Index;