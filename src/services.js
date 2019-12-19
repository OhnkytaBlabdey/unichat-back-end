'use-strict';


const captcha = require('./service/captcha');
const CreateChannel = require('./service/createChannel');
const CreateGroup = require('./service/createGroup');
const GetInviteCode = require('./service/getInviteCode');
const GetUsers = require('./service/getUsersInGroup');
const Index = require('./service/index');
const JoinIn = require('./service/joinIn');
const Kick = require('./service/kick');
const Modify = require('./service/modify');
const SignIn = require('./service/signIn');
const signUp = require('./service/signUp');
const UserInfo = require('./service/userInfo');
const UserIsInGroup = require('./service/userIsInGroup');

const services = {
	captcha: captcha,
	createChannel: CreateChannel,
	createGroup: CreateGroup,
	getInviteCode: GetInviteCode,
	getUsers: GetUsers,
	index: Index,
	joinIn: JoinIn,
	kick: Kick,
	modify: Modify,
	signin: SignIn,
	signup: signUp,
	userInfo: UserInfo,
	userIsInGroup: UserIsInGroup
};

module.exports = services;