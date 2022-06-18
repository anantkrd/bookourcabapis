const pool=require('../../config/database');
var moment = require('moment')
module.exports={
    getMyBookings:async(driverId,pageId)=>{
        let start=((pageId-1)*10);
        let perPage=10;
        sqlcheck="SELECT * FROM `prayag_booking` WHERE isDeleted='N' and status='confirm' and driverId=? order by id desc limit ?,?";
        
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[driverId,start,perPage],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    },  
    getbookingReport:async(driverId,pageId)=>{
        let start=((pageId-1)*10);
        let perPage=10;
        sqlcheck="SELECT * FROM `prayag_booking` WHERE booking.isDeleted='N' and driverId=? order by id desc limit ?,?";
        
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[driverId,start,perPage],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    },  
    startTrip:async(userId,bookingId,startKm)=>{
        let dateNow=moment().format('YYYY-MM-DD hh:mm:ss');
        console.log("startKm=========="+startKm+"***bookingId*"+bookingId);
        sqlcheck="update `prayag_booking` set startKm=?,journyStartTime=?,journyStatus='start' WHERE id=?";   
        console.log("update `prayag_booking` set startKm='"+startKm+"',journyStartTime='"+dateNow+"',journyStatus='start' WHERE id="+bookingId;   )     
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[startKm,dateNow,bookingId],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    },  
    endTrip:async(userId,bookingId,endKm)=>{
        sqlcheck="SELECT * FROM `prayag_booking` WHERE booking.isDeleted='N' and id=?";        
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[bookingId],  (error, results)=>{
                if(error){
                    return reject(error);
                }else{
                    console.log(JSON.stringify(results));
                    let startKm=results[0]['startKm'];
                }
                return resolve(results);
            });
        });
    },    
    
    getPaymentReport:async(driverId,pageId)=>{
        let start=((pageId-1)*10);
        let perPage=10;
        sqlcheck="SELECT * FROM `prayag_booking` WHERE booking.isDeleted='N' and driverId=? order by id desc limit ?,?";        
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[driverId,start,perPage],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    },    
    
}