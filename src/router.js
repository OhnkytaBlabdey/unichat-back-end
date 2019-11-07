'use-strict';

const express = require('express');
const services = require('./services');
const Router = express.Router();

Router.get('/captcha', services.captcha)
	// .post('/captcha', services.captcha)
	.get('/signup', services.signup)
	.post('/signup', services.signup);

module.exports = Router;