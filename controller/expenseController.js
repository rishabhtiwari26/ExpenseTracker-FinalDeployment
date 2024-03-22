const sequelize = require('../util/database')
const Expense = require('../model/expenseModel')
const User = require('../model/userModel')
const DownloadExpense=require('../model/downloadExpenseModels')


const jwt =require('jsonwebtoken')
const AWS=require('aws-sdk')


function decodedId(token){
    return jwt.verify(token,process.env.TOKEN_SECRET)
}
function uploadToS3(data,filename){
    const BUCKET_NAME=process.env.BUCKET_NAME;
    const IAM_USER_KEY=process.env.IAM_USER_KEY
    const IAM_USER_SECRET=process.env.IAM_USER_SECRET
    
    let s3bucket= new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET
    })

    let params={
        Bucket:BUCKET_NAME,
        Key:filename,
        Body:data,
        ACL:'public-read'
    }
    return new Promise((resolve,reject)=>{
        s3bucket.upload(params,(err,s3response)=>{
            if(err){
                console.log(err,'something went wrong in aws')
                reject(err)
            }else{
                console.log('success',s3response)
                resolve(s3response.Location)
            }
        })

    })
}

exports.downloadExpense=async (req,res,next)=>{
   try{ 
    const reqUser=decodedId(req.headers.authorization).userid
    const user=await User.findByPk(reqUser)
    const foundExpenses=await user.getExpenses()
    const stringifiedData=JSON.stringify(foundExpenses)

    const fileName=`${user.id}Expense${new Date()}.txt`
    const fileURL=await uploadToS3(stringifiedData,fileName)
    // console.log(user)
    await DownloadExpense.create({linkURL:fileURL,userDetailId:user.id})
    res.status(200).send({fileURL,success:true})
    }catch(err){
        console.log(err)
        res.status(500).send({fileURL:'',success:false,err:err})
    }
}

exports.getExpense=(req,res,next)=>{

    try{
        const expensePerPage=Number(req.headers.rowsperpage)
        console.log('req.headers',req.headers)
        const userId=decodedId(req.headers.authorization).userid
        const page=Number(req.query.page)
        console.log('expensePerPage,page',expensePerPage,page)
        // console.log('userId',userId)
        Expense.count({where:{userDetailId:userId}})
            .then((total)=>{
                const totalNoOfExpense=total
                Expense.findAll({
                    where:{userDetailId:userId},
                    offset:(page-1)*expensePerPage,
                    limit:expensePerPage
                    })
                    .then(expenses=>{
                        // console.log(expenses)
                        // console.log('page',page,'expenses',expenses)
                        res.send({
                            expenses:expenses,
                            currentPage:page,
                            hasNextPage:page*expensePerPage<totalNoOfExpense,
                            nextPage:page+1,
                            hasPreviousPage:page>1,
                            previousPage:page-1,
                            totalPage:Math.ceil(totalNoOfExpense/expensePerPage)
                        })
                    })
                    .catch(err=>console.log(err))
            })}catch(err){
                console.log(err)
            }
        }
    

exports.addExpense=async(req,res,next)=>{
    const t= await sequelize.transaction()
    try{
        // console.log(req.body,decodedId(req.headers.authorization),t)
        const newExpense=await Expense.create({
        expenseAmount:req.body.amount,
        description:req.body.description,
        category:req.body.cat,
        userDetailId:decodedId(req.headers.authorization).userid
    },{transaction:t})
        const newUser= await User.findByPk(decodedId(req.headers.authorization).userid)
        const updatedUser= await newUser.update({totalAmount:newUser.totalAmount+parseFloat(req.body.amount)},{transaction:t})
        // console.log(updatedUser,'updatedUser')
        if (updatedUser[0] === 0) {
            throw new Error("No rows were updated");
        }
        await t.commit()
    }catch(err){
        console.log('newError',err)
        await t.rollback()
    }}
exports.deleteExpense=async (req,res,next)=>{
    const t= await sequelize.transaction()
    try{
        const expenseFound=await Expense.findByPk(req.body.id)
        // console.log(req.headers,re   q.body,decodedId(req.body.token))
        const newUser= await User.findByPk(decodedId(req.body.token).userid)
        const updatedUser= await newUser.update({
            totalAmount:newUser.totalAmount-parseFloat(expenseFound.expenseAmount)
        },{
            transaction:t
        })
        await expenseFound.destroy({transaction:t})
        if (updatedUser[0] === 0) {
            throw new Error("No rows were updated");
        }
        await t.commit()
        res.status(200).send({success:true,message:'Expense Deleted'})
    }catch(err){
        console.log(err)
        await t.rollback()
        res.status(401).send({success:false,message:'Rolled back'})
    }

}