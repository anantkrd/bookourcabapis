const { json } = require('body-parser');
const{create,getCabs,createSearchLog}=require('./booking.service');
const{createUser,getUserByMobile}=require('../user/user.controller');
module.exports={
    create_booking:(data,callBack)=>{
        create(data,(err,results)=>{
            if(err)return callBack(err);
            return callBack(null,results);
        });
    },
    create_booking_log:(data,callBack)=>{
        console.log("data===="+JSON.stringify(data));
        createSearchLog(data,(err,results)=>{
            if(err){
                return callBack(err);
            }else{

            }
            console.log("results=="+results);
            return callBack(null,results);
        });
    },
    getCabs:async(data,callBack)=>{
        let datares=await getCabs(data); 
         console.log("datares*=="+JSON.stringify(datares));
         return datares;
        /*await getCabs(data,(err,results)=>{
            if(err){
                return  err;//callBack(err);
            }else{

            }
            console.log("results*=="+results);
            return results;//callBack(null,results);
        });*/
    }
}