'use-strict';

const express = require('express');
const services = require('./services');
const Router = express.Router();


Router
	.get('/', services.index)
	.post('/', services.index)
	//====================================
	//                                    
	//  ##   ##   ####  #####  #####    
	//  ##   ##  ##     ##     ##  ##   
	//  ##   ##   ###   #####  #####    
	//  ##   ##     ##  ##     ##  ##   
	//   #####   ####   #####  ##   ##  
	//                                    
	//====================================
	.get('/modify', services.modify)
	.post('/modify', services.modify)
	.get('/signup', services.signup)
	.post('/signup', services.signup)
	.get('/signin', services.signin)
	.post('/signin', services.signin)
	//================================================
	//                                                
	//   ####    #####     #####   ##   ##  #####   
	//  ##       ##  ##   ##   ##  ##   ##  ##  ##  
	//  ##  ###  #####    ##   ##  ##   ##  #####   
	//  ##   ##  ##  ##   ##   ##  ##   ##  ##      
	//   ####    ##   ##   #####    #####   ##      
	//                                                
	//================================================
	.get('/createGroup', services.createGroup)
	.post('/createGroup', services.createGroup)
	.get('/getInviteCode', services.getInviteCode)
	.post('/getInviteCode', services.getInviteCode)
	//=============================================================
	//                                                             
	//   ####    ###    #####   ######   ####  ##   ##    ###    
	//  ##      ## ##   ##  ##    ##    ##     ##   ##   ## ##   
	//  ##     ##   ##  #####     ##    ##     #######  ##   ##  
	//  ##     #######  ##        ##    ##     ##   ##  #######  
	//   ####  ##   ##  ##        ##     ####  ##   ##  ##   ##  
	//                                                             
	//=============================================================
	.post('/captcha', services.captcha)
	.get('/captcha', services.captcha);

module.exports = Router;