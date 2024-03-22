const express = require('express')
const route=express.Router()
const orderController = require('../controller/orderController')

route.get('/premiummembership',orderController.purchaseMembership)
route.post('/updatemembership',orderController.updateMembership)


module.exports=route