const express = require('express')
const route=express.Router()
const userController = require('../controller/userController')
const expenseController = require('../controller/expenseController')

route.post('/signup',userController.signUp)
route.post('/login',userController.login)
route.get('/download',expenseController.downloadExpense)


module.exports=route