const { json } = require('body-parser');
const{startTrip,endTrip}=require('./driver.service');
const{createUser,getUserByMobile}=require('../user/user.controller');
module.exports={
    startTrip:async(userId,bookingId,startKm)=>{
        treipRes=await startTrip(userId,bookingId,startKm);
    },
    endTrip:async(userId,bookingId, endKm)=>{
        treipRes=await endTrip(userId,bookingId,endKm)
    },
}