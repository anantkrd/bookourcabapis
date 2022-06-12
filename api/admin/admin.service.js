const pool=require('../../config/database');
module.exports={
       
    getBookingsAdminHome:async(pageId,callBack)=>{
        let start=((pageId-1)*10);
        let perPage=10;
        sqlcheck="SELECT booking.*,cabs.cabType,cabs.ac,cabs.bags,cabs.capacity,cabs.cars,cabs.note,(select mobileNo from prayag_users where id=booking.userId ) as mobileNo FROM `prayag_booking` booking inner JOIN prayag_cabs cabs ON booking.cabId=cabs.id WHERE booking.isDeleted='N' and booking.status='waiting' order by booking.id desc limit ?,?";
        
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[start,perPage],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        })
    },
    getBookingsForAgent:async(pageId)=>{
        let start=((pageId-1)*10);
        let perPage=10;
        sqlcheck="SELECT booking.*,cabs.cabType,cabs.ac,cabs.bags,cabs.capacity,cabs.cars,cabs.note,(select mobileNo from prayag_users where id=booking.userId ) as mobileNo FROM `prayag_booking` booking inner JOIN prayag_cabs cabs ON booking.cabId=cabs.id WHERE booking.isDeleted='N' and agentPrice>0 and agentId=0 and booking.status='waiting' order by booking.id desc limit ?,?";
        
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[start,perPage],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    },   
    updateAgentAmount:async(amount,bookingId)=>{
        
        sqlcheck="update prayag_booking set agentPrice=? where orderId=?";
        console.log("update prayag_booking set agentPrice="+amount+" where orderId="+bookingId)
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[amount,bookingId],  (error, results)=>{
                if(error){
                    return reject({code:500,msg:"error while adding agent amount"});
                }
                return resolve({code:200,msg:"Record updated"});
            });
        })
    }, 
    getCompletedBookings:async(pageId)=>{
        let start=((pageId-1)*10);
        let perPage=10;
        sqlcheck="SELECT booking.*,cabs.cabType,cabs.ac,cabs.bags,cabs.capacity,cabs.cars,cabs.note,(select mobileNo from prayag_users where id=booking.userId ) as mobileNo FROM `prayag_booking` booking inner JOIN prayag_cabs cabs ON booking.cabId=cabs.id WHERE booking.isDeleted='N' and driverId>0  and agentId>0 and booking.status='completed' order by booking.id desc limit ?,?";
        
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[start,perPage],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }, 
    getReadyBooking:async(pageId)=>{
        let start=((pageId-1)*10);
        let perPage=10;
        sqlcheck="SELECT booking.*,cabs.cabType,cabs.ac,cabs.bags,cabs.capacity,cabs.cars,cabs.note,(select mobileNo from prayag_users where id=booking.userId ) as mobileNo FROM `prayag_booking` booking inner JOIN prayag_cabs cabs ON booking.cabId=cabs.id WHERE booking.isDeleted='N' and driverId>0  and carId>0 and booking.status='confirm' order by booking.id desc limit ?,?";
        
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[start,perPage],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    },  
    
    getConfirmBooking:async(pageId)=>{
        let start=((pageId-1)*10);
        let perPage=10;
        sqlcheck="SELECT booking.*,cabs.cabType,cabs.ac,cabs.bags,cabs.capacity,cabs.cars,cabs.note,(select mobileNo from prayag_users where id=booking.userId ) as mobileNo FROM `prayag_booking` booking inner JOIN prayag_cabs cabs ON booking.cabId=cabs.id WHERE booking.isDeleted='N' and (driverId=0 or carId=0)  and agentId>0 and booking.status='confirm' order by booking.id desc limit ?,?";
        
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[start,perPage],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    },   

}