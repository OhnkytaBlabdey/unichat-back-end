'use-strict';


const signUp = require('./service/signUp');
const captcha = require('./service/captcha');
const CreateGroup = require('./service/createGroup');
const SignIn = require('./service/signIn');
const Index = require('./service/index');
const Modify = require('./service/modify');
const GetInviteCode = require('./service/getInviteCode');
const JoinIn = require('./service/joinIn');
const Kick = require('./service/kick');
const CreateChannel = require('./service/createChannel');
const GetUsers = require('./service/getUsersInGroup');

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
	signup: signUp
};

module.exports = services;