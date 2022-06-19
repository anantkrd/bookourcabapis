const { json } = require('body-parser');
const{startTrip,endTrip}=require('./driver.service');
const{createUser,getUserByMobile}=require('../user/user.controller');
module.exports={
    startTrip:async(userId,bookingId,startKm)=>{
        treipRes=await startTrip(userId,bookingId,startKm);
        //console.log("treipRes==="+JSON.stringify(treipRes));
        return treipRes;
    },
    endTrip:async(userId,bookingId, endKm)=>{
        treipRes=await endTrip(userId,bookingId,endKm);
        //console.log("endTrip==="+JSON.stringify(treipRes));
        return treipRes;
    },
    completeTrip:async(userId,bookingId)=>{
        treipRes=await completeTrip(userId,bookingId);
        //console.log("endTrip==="+JSON.stringify(treipRes));
        return treipRes;
    },
    
}