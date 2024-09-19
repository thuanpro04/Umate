const express= require('express');
const { hanleLoginWithGoogle } = require('../Controller/LoginController');
const appRouters= express();

appRouters.post('/login', hanleLoginWithGoogle)
module.exports=appRouters