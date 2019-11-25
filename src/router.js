'use-strict';

const express = require('express');
const services = require('./services');
const Router = express.Router();
const bodyParpser = require('body-parser');

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
    .get('/captcha', services.captcha);

module.exports = Router;