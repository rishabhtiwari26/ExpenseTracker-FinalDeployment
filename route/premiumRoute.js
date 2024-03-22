const express = require('express')
const route=express.Router()
const premiumController = require('../controller/premiumController')

route.get('/showleaderboard',premiumController.showLeaderBoard)



module.exports=route