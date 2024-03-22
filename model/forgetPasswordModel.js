const Sequelize  = require('sequelize')
const sequelize=require('../util/database')

const passwordLink = sequelize.define('ForgotPasswordRequests',{
    id:{
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
        type:Sequelize.INTEGER
    },
    linkid:{
        type:Sequelize.STRING
    },
    isactive:{
        type:Sequelize.BOOLEAN
    }
})
module.exports=passwordLink