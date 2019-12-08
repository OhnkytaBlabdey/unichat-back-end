'use-strict';

const express = require('express');
const Router = express.Router();

const services = require('./services');

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
	.post('/modify', services.modify)
	.post('/signup', services.signup)
	.get('/signup', services.signup)
	.post('/signin', services.signin)
	.get('/signin', services.signin)
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
	.get('/joinIn', services.joinIn)
	.post('/joinIn', services.joinIn)
	.get('/kick', services.kick)
	.post('/kick', services.kick)
	//=============================================================
	//                                                             
	//   ####    ###    #####   ######   ####  ##   ##    ###    
	//  ##      ## ##   ##  ##    ##    ##     ##   ##   ## ##   
	//  ##     ##   ##  #####     ##    ##     #######  ##   ##  
	//  ##     #######  ##        ##    ##     ##   ##  #######  
	//   ####  ##   ##  ##        ##     ####  ##   ##  ##   ##  
	//                                                             
	//=============================================================
	.get('/captcha', services.captcha);

module.exports = Router;