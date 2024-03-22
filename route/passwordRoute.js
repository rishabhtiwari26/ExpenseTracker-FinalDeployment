const express = require('express')
const route=express.Router()
const passwordController = require('../controller/passwordController')


route.post('/forgotPassword',passwordController.forgetPassword)
route.get('/resetpassword/:resetLink',passwordController.resetPassword)
route.post('/newpassword',passwordController.newPassword)
module.exports=route