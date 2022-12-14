const { json } = require('body-parser');
const{create,getCabs,createSearchLog,updateCab}=require('./booking.service');
const{createUser,getUserByMobile}=require('../user/user.controller');
module.exports={
    create_booking:async(data)=>{
        let datares=await create(data); 
         console.log("created Booking*=="+JSON.stringify(datares));
         return datares;
        /*console.log("data===="+JSON.stringify(data));
        create(data,(err,results)=>{
            if(err)return callBack(err);
            return callBack(null,results);
        });*/
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
    },
    updateCab:async(data)=>{
        try{
            let res=await this.updateCab(data);
            return res;
        }catch(err){
            throw err;
        }
    }
}