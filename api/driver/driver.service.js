const pool=require('../../config/database');
var moment = require('moment')
module.exports={
    getMyBookings:async(driverId,pageId)=>{
        let start=((pageId-1)*10);
        let perPage=10;
        sqlcheck="SELECT prayag_booking.*,(select mobileNo from prayag_users where id=prayag_booking.userId ) as mobileNo FROM `prayag_booking` WHERE isDeleted='N' and (status='confirm' || status='started') and driverId=? order by id desc limit ?,?";
        
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
        sqlcheck="SELECT * FROM `prayag_booking` WHERE isDeleted='N' and driverId=? order by id desc limit ?,?";
        
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
                    console.log("********"+JSON.stringify(results));
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
                    sqlcheck="update `prayag_booking` set endKm=?,journyEndTime=?,journyStatus='completed',extraAmount=?,extraRate=?,journyDistance=? WHERE orderId=?";   
                    console.log("update `prayag_booking` set endKm='"+endKm+"',journyEndTime='"+dateNow+"',journyStatus='completed',extraAmount=?,extraRate=?,journyDistance=? WHERE orderId="+bookingId)     
                    new Promise((resolve, reject)=>{
                        pool.query(sqlcheck,[endKm,dateNow,extraAmount,rate,journyDistance,bookingId],  (error, resultsup)=>{
                            
                        });
                    });
                }
                return resolve(results);
            });
        });
    },    
    completeTrip:async(userId,bookingId)=>{
        let dateNow=moment().format('YYYY-MM-DD hh:mm:ss');
        sqlcheck="SELECT * FROM `prayag_booking` WHERE isDeleted='N' and journyStatus='completed' and status='started' and orderId=?";        
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[bookingId],  (error, results)=>{
                if(error){
                    return reject(error);
                }else{
                    console.log(JSON.stringify(results));
                    let extraAmount=results[0]['extraAmount'];
                    let pending=results[0]['pending']+results[0]['extraAmount'];
                    let finalAmount=results[0]['finalAmount']+extraAmount;
                    let cashAmount=pending;
                    sqlcheck="update `prayag_booking` set status='completed',pending='0',finalAmount=?,paid=?,extraAmount=?,cashAmount=? WHERE orderId=?";   
                    console.log("update `prayag_booking` set status='completed' WHERE orderId="+bookingId)     
                    new Promise((resolve, reject)=>{
                        pool.query(sqlcheck,[finalAmount,finalAmount,extraAmount,cashAmount,bookingId],  (error, resultsup)=>{
                            
                        });
                    });
                }
                return resolve(results);
            });
        });
        sqlcheck="update `prayag_booking` set status='completed' WHERE orderId=?";   
        console.log("update `prayag_booking` set status='completed' WHERE orderId="+bookingId)     
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[bookingId],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    },  
    
    getPaymentReport:async(driverId,pageId)=>{
        let start=((pageId-1)*10);
        let perPage=10;
        sqlcheck="SELECT * FROM `prayag_booking` WHERE isDeleted='N' and driverId=? order by id desc limit ?,?";        
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