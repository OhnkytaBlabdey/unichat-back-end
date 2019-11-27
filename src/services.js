'use-strict';


const signUp = require('./service/signUp');
const captcha = require('./service/captcha');
const CreateGroup = require('./service/createGroup');
const SignIn = require('./service/signIn');
const Index = require('./service/index');
const Modify = require('./service/modify');
const GetInviteCode = require('./service/getInviteCode');
const JoinIn = require('./service/joinIn');

const services = {
	captcha: captcha,
	createGroup: CreateGroup,
	getInviteCode: GetInviteCode,
	index: Index,
	joinIn: JoinIn,
	modify: Modify,
	signin: SignIn,
	signup: signUp
};

module.exports = services;