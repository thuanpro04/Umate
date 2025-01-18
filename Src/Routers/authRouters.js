const express= require('express');
const { handleLoginWithGoogle } = require('../Controller/LoginController');
const appRouters= express();
appRouters.post('/login', handleLoginWithGoogle)
module.exports=appRouters