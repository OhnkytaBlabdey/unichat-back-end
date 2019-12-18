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
 *
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
const getUsers = (req, res) => {
	log.debug('get users in group requested.');
	if (!loginHandler(req, res)) return;
	const params = req.para;
	const gid = params.gid || null;
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

module.exports = getUsers;