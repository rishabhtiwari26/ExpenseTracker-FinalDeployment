const order = require('../model/orderModel')
const Razorpay = require('razorpay')
const user=require('../model/userModel')
const jwt =require('jsonwebtoken')
const sequelize = require('../util/database')
function generateAccessToken(id,ispremiumuser){
    return jwt.sign({userid:id,ispremiumuser},process.env.TOKEN_SECRET)
}
function decodedId(token){
    return jwt.verify(token,process.env.TOKEN_SECRET)
}

exports.purchaseMembership=(req,res,next)=>{
    try{
        // console.log(req.user,req.body)
        let rzp=new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })
        const amount=2500
        rzp.orders.create({amount,currency:'INR'},(err,order)=>{
            if(err){
                console.log(err)
                throw new Error(err)
            }
            console.log('inside')
            console.log(req.headers)
            user.findOne({where:{id:decodedId(req.headers.authorization).userid}})
                .then(user=>{
                    user.createOrder({orderid:order.id,status:'pending'})
                        .then(()=>{
                            res.status(201).json({order,key_id:rzp.key_id})
                        })
                        .catch(e=>{
                            throw new Error(e)
                        })
                })
        })
    }catch(e){
        console.log(e)
    }

}

exports.updateMembership=async (req,res,next)=>{
        console.log('inside updatemembership')
        const {order_id,payment_id}=req.body
        // console.log(order_id,payment_id)
        const t =await sequelize.transaction()
        try{
            const reqUser= await user.findOne({where:{id:decodedId(req.headers.authorization).userid}})
            // console.log(reqUser,'reqUser')
            const newOrder=await order.findOne({where:{orderid:order_id}})
            // console.log(newOrder,'newOrder')
            await newOrder.update({paymentid:payment_id,status:'SUCCESSFUL'},{transaction:t})
            await reqUser.update({ispremiumuser:true},{transaction:t})
            // console.log(updatedOrder,'updatedOrder',updatedUser,'updatedUser')
            // if(updatedOrder[0]===0 || updatedUser[0]===0){
            //     console.log('inside if statement')
            //     throw new Error('Not able to update')
            // }
            await t.commit()
            console.log('before return')
            // console.log(reqUser)
            return res.status(202).json({sucess:true,message:'Transaction Successful',token:generateAccessToken(reqUser.id,reqUser.ispremiumuser)})
    }catch(e){
        await t.rollback()
        console.log('transaction failed',e)
        }
    }