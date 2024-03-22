const Sequelize  = require('sequelize')
const sequelize=require('../util/database')


const order = sequelize.define('order',{
    id:{
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
        type:Sequelize.INTEGER
    },
    orderid:{
        type:Sequelize.STRING
    },
    status:{
        type:Sequelize.STRING
    },
    paymentid:{
        type:Sequelize.STRING
    }
}
)
module.exports=order