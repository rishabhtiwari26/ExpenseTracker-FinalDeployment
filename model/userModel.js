const Sequelize  = require('sequelize')
const sequelize=require('../util/database')


const user = sequelize.define('userDetails',{
    id:{
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
        type:Sequelize.INTEGER
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    ispremiumuser:Sequelize.BOOLEAN,
    totalAmount:Sequelize.DOUBLE
}
)
module.exports=user