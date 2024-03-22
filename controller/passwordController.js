const Sib = require('sib-api-v3-sdk');
require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
const passwordLink = require('../model/forgetPasswordModel');
const user = require('../model/userModel');
const sequelize = require('../util/database');
const client=Sib.ApiClient.instance
const apiKey=client.authentications['api-key']
apiKey.apiKey=process.env.API_KEY
const jwt =require('jsonwebtoken')
const bcrypt = require('bcrypt')
function generateAccessToken(id,isactive){
    return jwt.sign({userid:id,isactive},process.env.TOKEN_SECRET)
}
function decodedId(token){
    return jwt.verify(token,process.env.TOKEN_SECRET)
}


exports.forgetPassword=async (req,res,next)=>{
    const t= await sequelize.transaction()
    const newLink=uuidv4()
    const tranEmailApi=new Sib.TransactionalEmailsApi()
    const sender={
        email:'rtiwari1@ymail.com',
        name:'rishabh'
    }
    const receiver=[
        {
            email:req.body.emailId
        }
    ]
    user.findOne({where:{email:req.body.emailId}})
        .then((user)=>{
            passwordLink.create({
                linkid:newLink,
                userDetailId:user.id,
                isactive:true
        },{transaction:t}).then(()=>{
            tranEmailApi.sendTransacEmail({
                sender,
                to:receiver,
                Subject: 'OTP for password',
                textContent:
                `Please Click on the below link for reseting your password.
                http://13.235.83.111/password/resetpassword/${newLink}`
            }).then(()=>{
                t.commit()
                res.status(201).send('Email sent')
            })
            .catch(e=>console.log(e))
        }).catch(e=>{
            console.log(e)
            t.rollback()
        })
    }).catch(e=>{
        console.log(e)
        t.rollback()
    })

        
}    

exports.resetPassword=(req,res,next)=>{
    const newLink=req.params.resetLink
    passwordLink.findOne({where:{linkid:newLink}})
    .then(foundLink=>{
        if(foundLink){
            if(foundLink.isactive==1){
                const newtoken=generateAccessToken(foundLink.userDetailId,foundLink.isactive)
                foundLink.update({isactive:false}).then(()=>{
                    res.send(`<html>

                            <form>
                                <label for="newpassword">Enter New password</label>
                                <input name="newpassword" id='newpassword' type="password" required></input>
                                <button type='button' onclick=newf()>reset password</button>
                            </form>
                            <script>
                                function newf(){
                                    const password=document.getElementById('newpassword').value
                                    const url='http://13.235.83.111/reset_password.htm?message=Reset%20your%20password"&token=${newtoken}&pass='+password
                                    window.location.href= url
                                }
                            </script>
                        </html>`);
                }).catch(e=>{
                    console.log('userlink cant get updated')
                })
                
                
            }
            else{
                res.send({isActive:'false',message:'Link is not active'})
            }
        }else{
            res.send({isActive:'false',message:'Link Not Found'})
        }
        
    })
    .catch(e=>console.log(e))
}
exports.newPassword=(req,res,next)=>{
    const t = sequelize.transaction()
    const userIdStatus=decodedId(req.body.token)
    console.log(userIdStatus)
    user.findByPk(userIdStatus.userid).then(user=>{
        if(user){
            console.log(req.body)
            console.log(user)
            bcrypt.hash(req.body.newPassword,10,(err,hash)=>{
                if(err){
                    throw new Error(e)
                }
                console.log(hash)
                user.update({password:hash}).then(()=>{
                    res.status(200).send({message:'Password Being Updated',success:'true'})
                }).catch(e=>{
                    throw new Error(e)
                })
            })
        }
        else{
            throw new Error('user not found')
        }
        
    }).catch(e=>{
        throw new Error(e)
    })
}