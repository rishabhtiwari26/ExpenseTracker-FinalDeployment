const Sequelize  = require('sequelize')
const sequelize=require('../util/database')

const downloadExpense = sequelize.define('downloadLink',{
    id:{
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
        type:Sequelize.INTEGER
    },
    linkURL:{
        type:Sequelize.STRING,
        allowNull:false
    }
}
)
module.exports=downloadExpense