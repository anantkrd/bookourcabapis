const pool=require('../../config/database');
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