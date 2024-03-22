const express = require('express')
const dotenv=require('dotenv');
dotenv.config()

const cors = require('cors')
const app = express()
const bodyParser=require('body-parser')
const sequelize  = require('./util/database')
const fs=require('fs')
const path=require('path')

const user = require('./model/userModel')
const expense = require('./model/expenseModel')
const order=require('./model/orderModel')
const passwordLink = require('./model/forgetPasswordModel')
const downloadExpense=require('./model/downloadExpenseModels')

const userRoute=require('./route/userRoute')
const expenseRoute=require('./route/expenseRoute')
const orderRoute=require('./route/orderRoute')
const premiumRoute=require('./route/premiumRoute')
const passwordRoute=require('./route/passwordRoute')

const accessLogStream=fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags:'a'})

app.use(cors())
app.use(bodyParser.json())



app.use('/user',userRoute)
app.use('/expense',expenseRoute)
app.use('/purchase',orderRoute)
app.use('/premium',premiumRoute)
app.use('/password',passwordRoute)
app.use('/reset_password.htm', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'reset_password.htm'));
});

app.use('/addExpense.htm', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addExpense.htm'));
});
app.use((req,res,next)=>{
    console.log('urll',req.url)
    res.sendFile(path.join(__dirname, `views/${req.url}`))
})


user.hasMany(expense)
expense.belongsTo(user,{constraint:true,onDelete:'CASCADE'})

user.hasMany(order)
order.belongsTo(user,{constraint:true,onDelete:'CASCADE'})

user.hasMany(passwordLink)
passwordLink.belongsTo(user,{constraint:true,onDelete:'CASCADE'})

user.hasMany(downloadExpense)
downloadExpense.belongsTo(user,{constraint:true,onDelete:'CASCADE'})

sequelize.sync()
    .then(res=>{
        // console.log(res)
        app.listen(process.env.PORT || 3000)
    })
    .catch(e=>console.log(e))