'use-strict';


const loginHandler = require('../util/handleLogin');
const errorHandler = require('../util/handleInternalError');
const sendMsg = require('../util/sendMsg');
const Status = require('../status');
const User = require('../db/po/user_model');

const UserInfo = (req, res) => {
	if (!loginHandler(req, res)) return;
	const params = req.para;
	const uid = params.uid || null;
	User.findOne({
		attributes: [
			'avatar',
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

module.exports = UserInfo;