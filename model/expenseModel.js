const Sequelize  = require('sequelize')
const sequelize=require('../util/database')


const expense = sequelize.define('expenses',{
    id:{
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
        type:Sequelize.INTEGER
    },
    expenseAmount:{
        type:Sequelize.DOUBLE,
        allowNull:false
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    category:{
        type:Sequelize.STRING,
        allowNull:false
    }
}
)
module.exports=expense