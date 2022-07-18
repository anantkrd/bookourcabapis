const pool=require('../../config/database');
module.exports={
       
    getBookingsAdminHome:async(pageId,callBack)=>{
        let start=((pageId-1)*5);
        let perPage=5;
        sqlcheck="SELECT booking.*,cabs.cabType,cabs.ac,cabs.bags,cabs.capacity,cabs.cars,cabs.note,(select mobileNo from prayag_users where id=booking.userId ) as mobileNo FROM `prayag_booking` booking inner JOIN prayag_cabs cabs ON booking.cabId=cabs.id WHERE booking.isDeleted='N' and booking.status='waiting' order by booking.id desc limit ?,?";
        sqlcheckCount="SELECT count(booking.id) as rowCount FROM `prayag_booking` booking inner JOIN prayag_cabs cabs ON booking.cabId=cabs.id WHERE booking.isDeleted='N' and booking.status='waiting' order by booking.id desc";
        let resCount=await module.exports.getPageCount(sqlcheckCount,perPage);

        console.log("resCount=="+JSON.stringify(resCount));
        let rowCount=resCount[0]['rowCount'];        
        totalPage=rowCount/perPage;
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[start,perPage],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                //results['rowCount']=rowCount;
                results=JSON.stringify({results:results,rowCount:rowCount,totalPage:totalPage});
                return resolve(results);
            });
        })
    },
    getBookingsForAgent:async(pageId)=>{
        let start=((pageId-1)*10);
        let perPage=10;
        sqlcheck="SELECT booking.*,cabs.cabType,cabs.ac,cabs.bags,cabs.capacity,cabs.cars,cabs.note,(select mobileNo from prayag_users where id=booking.userId ) as mobileNo FROM `prayag_booking` booking inner JOIN prayag_cabs cabs ON booking.cabId=cabs.id WHERE booking.isDeleted='N' and agentPrice>0 and agentId=0 and booking.status='waiting' order by booking.id desc limit ?,?";
        sqlcheckCount="SELECT count(booking.id) rowCount FROM `prayag_booking` booking inner JOIN prayag_cabs cabs ON booking.cabId=cabs.id WHERE booking.isDeleted='N' and agentPrice>0 and agentId=0 and booking.status='waiting' order by booking.id desc";
        let resCount=await module.exports.getPageCount(sqlcheckCount,perPage);

        console.log("resCount=="+JSON.stringify(resCount));
        let rowCount=resCount[0]['rowCount'];        
        totalPage=rowCount/perPage;
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[start,perPage],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                results=JSON.stringify({results:results,rowCount:rowCount,totalPage:totalPage});
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
        sqlcheckCount="SELECT count(*) as rowCount FROM `prayag_booking` booking inner JOIN prayag_cabs cabs ON booking.cabId=cabs.id WHERE booking.isDeleted='N' and driverId>0  and agentId>0 and booking.status='completed' order by booking.id desc";
        let resCount=await module.exports.getPageCount(sqlcheckCount,perPage);

        console.log("resCount=="+resCount);
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
    getPageCount:async(sqlcheck,pageCount)=>{
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    },
    getAgets:async(pageId,callBack)=>{
        let start=((pageId-1)*5);
        let perPage=5;
        sqlcheck="SELECT * FROM prayag.prayag_users where userType='agent' and isDeleted='N'; order by id desc order by id desc limit ?,?";
        sqlcheckCount="SELECT * FROM prayag.prayag_users where userType='agent' and isDeleted='N'; order by id desc";
        let resCount=await module.exports.getPageCount(sqlcheckCount,perPage);

        console.log("resCount=="+JSON.stringify(resCount));
        let rowCount=resCount[0]['rowCount'];        
        totalPage=rowCount/perPage;
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[start,perPage],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                //results['rowCount']=rowCount;
                results=JSON.stringify({results:results,rowCount:rowCount,totalPage:totalPage});
                return resolve(results);
            });
        })
    },

}