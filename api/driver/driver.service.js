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
        sqlcheck="update `prayag_booking` set startKm=?,journyStartTime=?,status='started',journyStatus='start' WHERE orderId=?";   
        console.log("update `prayag_booking` set startKm='"+startKm+"',journyStartTime='"+dateNow+"',journyStatus='start' WHERE orderId="+bookingId)     
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
        let dateNow=moment().format('YYYY-MM-DD hh:mm:ss');
        sqlcheck="SELECT * FROM `prayag_booking` WHERE isDeleted='N' and orderId=?";        
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[bookingId],  (error, results)=>{
                if(error){
                    return reject(error);
                }else{
                    console.log(JSON.stringify(results));
                    let startKm=results[0]['startKm'];
                    let rate=results[0]['rate'];
                    let journyDistance=endKm-startKm;
                    let distance=results[0]['distance'];
                    let extraKm=0;
                    let extraAmount=0;
                    if(journyDistance>distance)
                    {
                        extraKm=journyDistance-distance;
                    }
                    extraAmount=rate*extraKm;
                    sqlcheck="update `prayag_booking` set endKm=?,journyEndTime=?,journyStatus='completed',extraAmount=?,extraRate=? WHERE orderId=?";   
                    console.log("update `prayag_booking` set endKm='"+endKm+"',journyEndTime='"+dateNow+"',journyStatus='completed',extraAmount=?,extraRate=? WHERE orderId="+bookingId)     
                    return new Promise((resolve, reject)=>{
                        pool.query(sqlcheck,[endKm,dateNow,extraAmount,rate,bookingId],  (error, results)=>{
                            if(error){
                                return reject(error);
                            }
                            return resolve(results);
                        });
                    });
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