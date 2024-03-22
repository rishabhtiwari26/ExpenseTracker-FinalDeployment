const expense = require('../model/expenseModel')
const Sequelize = require('sequelize');
const sequelize = require('../util/database'); 
const user =require('../model/userModel');




exports.showLeaderBoard= async (req,res,next)=>{
    const expenses = await user.findAll({
        attributes: ['name', 'totalAmount'],
        order:[['totalAmount','DESC']]
        
    })
    res.send(expenses)}
    
//       }).then(results => {
//         let promises=[]
//         results.forEach(element => {
//             promises.push( user.findByPk(element.dataValues.userDetailId).then(user=>{
//                 // console.log('element',element.dataValues.totalAmount,'user',user.dataValues.name)
//                 return{name:user.dataValues.name,totalAmount:element.dataValues.totalAmount}
//                 console.log(userDetails)
//             }).catch(e=>console.log(e))
//             )
            
//         });
//         Promise.all(promises).then(userDetails => {
//             const userDetailsMap = new Map();
//             userDetails.forEach(userDetail => {
//                 userDetailsMap.set(userDetail.name, userDetail.totalAmount);
//             });
//         console.log('resSend',userDetails)
//         res.send(userDetails)
//     }).catch(error => {
//         console.error('Error retrieving user details:', error);
//         res.status(500).send('Error retrieving user details');
//     });
// }).catch(error => {
//     console.error('Error executing query:', error);
//     res.status(500).send('Error executing query'); 
// });
// }