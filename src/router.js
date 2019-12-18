'use-strict';

const express = require('express');
// const bodyParser = require('body-parser');
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
	.get('/getUsers', services.getUsers)
	.post('/getUsers', services.getUsers)
	.get('/joinIn', services.joinIn)
	.post('/joinIn', services.joinIn)
	.get('/kick', services.kick)
	.post('/kick', services.kick)
	//==================================================================
	//                                                                  
	//   ####  ##   ##    ###    ##     ##  ##     ##  #####  ##      
	//  ##     ##   ##   ## ##   ####   ##  ####   ##  ##     ##      
	//  ##     #######  ##   ##  ##  ## ##  ##  ## ##  #####  ##      
	//  ##     ##   ##  #######  ##    ###  ##    ###  ##     ##      
	//   ####  ##   ##  ##   ##  ##     ##  ##     ##  #####  ######  
	//                                                                  
	//==================================================================
	.get('/createChannel', services.createChannel)
	.post('/createChannel', services.createChannel)
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