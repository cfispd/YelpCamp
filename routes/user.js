const express= require('express');
const router= express.Router();
const passport= require('passport');
const catchAsync = require('../utils/catchAsync');
const users= require('../controllor/users')

router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.createUser));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.login)

router.get('/logout',users.logout);


module.exports=router;