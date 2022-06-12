const pool=require('../../config/database');
module.exports={
    getMyBookings:async(agentId,pageId)=>{
        let start=((pageId-1)*10);
        let perPage=10;
        sqlcheck="SELECT booking.*,cabs.cabType,cabs.ac,cabs.bags,cabs.capacity,cabs.cars,cabs.note,(select mobileNo from prayag_users where id=booking.userId ) as mobileNo FROM `prayag_booking` booking inner JOIN prayag_cabs cabs ON booking.cabId=cabs.id WHERE booking.isDeleted='N' and agentPrice>0 and agentId=? and booking.status='confirm' order by booking.id desc limit ?,?";
        
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[agentId,start,perPage],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    },  
    getMyCompletedBookings:async(agentId,pageId)=>{
        let start=((pageId-1)*10);
        let perPage=10;
        sqlcheck="SELECT booking.*,cabs.cabType,cabs.ac,cabs.bags,cabs.capacity,cabs.cars,cabs.note,(select mobileNo from prayag_users where id=booking.userId ) as mobileNo FROM `prayag_booking` booking inner JOIN prayag_cabs cabs ON booking.cabId=cabs.id WHERE booking.isDeleted='N' and agentPrice>0 and agentId=? and booking.status='completed' order by booking.id desc limit ?,?";
        
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[agentId,start,perPage],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    },  
    getBookingsForAgent:async(agentId,pageId)=>{
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
    getSurge:async(cityName,callBack)=>{
        sql="SELECT city,compact,sedan,luxury,other FROM `prayag_surge` WHERE `city` LIKE '"+cityName+"' and isDeleted='N'";
        console.log("SQL=="+sql);
        return new Promise((resolve, reject)=>{
            pool.query(sql,  (error, elements)=>{
                
                if(elements=='' || elements.length<=0){
                    
                    let json=[{"city":"Pune","compact":1,"sedan":1,"luxury":1,"other":1}]
                    return resolve(json);
                }
               
                return resolve(elements);
            });
        });
    },    
    addPaymentAgent:async(advance,bookingId,agentId,paymentid,bookingAmount,pendingAmount,tripAmount,userPaid)=>{
        sql="INSERT INTO `prayag_agent_booking`(`agentId`, `bookingId`, `agentAmount`, `advance`,`tripAmount`,`userPaid`, `userPending`, `payToAgent`, `payToAgentType`, `paymentId`) VALUES ('"+agentId+"','"+bookingId+"','"+bookingAmount+"','"+advance+"','"+tripAmount+"','"+userPaid+"','"+pendingAmount+"','0','debit','"+paymentid+"')";
        
        return new Promise((resolve, reject)=>{
            pool.query(sql,  (error, elements)=>{
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    },    
    updateBookingDetails:async(razorpayOrderId,rawResponce)=>{
        sqlGetPay="select * from prayag_agent_booking where paymentId='"+razorpayOrderId+"'";
        let resData= JSON.stringify({code:'200',msg:'success',data:''});
        return new Promise((resolve, reject)=>{
            pool.query(sqlGetPay,  (error, result)=>{
                
                if(error){
                    return reject(error);
                }
                bookingAmount=result[0]['amount'];
                agentId=result[0]['agentId'];
                bookingId=result[0]['bookingId'];
                sqlUpdatePayment="UPDATE `prayag_agent_booking` SET `status`='completed',rawResponce='"+rawResponce+"' WHERE paymentId='"+razorpayOrderId+"'";
                pool.query(sqlUpdatePayment,  (error, elements)=>{     
                    if(error){
                        return reject(error);
                    }           
                });
                sqlUpdateBooking="UPDATE `prayag_booking` SET `agentId`='"+agentId+"',`status`='confirm' WHERE orderId='"+bookingId+"'";
                pool.query(sqlUpdateBooking,  (error, elements)=>{
                    if(error){
                        return reject(error);
                    }
                });
                
                return resolve(resData);
            });
            return resolve(resData);
            
            
            
        });
    },    
    addCar:async(userId,carModelName,carNo,carType,rcBook)=>{
        sqlCars="select * from prayag_agent_cars where carNo='"+carNo+"' and isDeleted='N'";
        
        return new Promise((resolve, reject)=>{
            pool.query(sqlCars,  (error, result)=>{
                
                if(result.length>0){
                    return resolve({code:500,msg:"Car already added"});
                }else{
                    insertCar="INSERT INTO `prayag_agent_cars`(`agentId`, `carNo`, `carModelName`, `carType`, `rcBook`, `isDeleted`) VALUES ('"+userId+"','"+carNo+"','"+carModelName+"','"+carType+"','"+rcBook+"','N')";
                    
                    pool.query(insertCar,  (error, elements)=>{
                        if(error){
                            return reject(error);
                        }
                    });
                    return resolve({code:200,msg:"Car added"});
                }
                
                
            });
            //return reject({code:500,msg:"some thing went wrong"});
        });
        
    },    
    getCars:async(agentId,pageId)=>{
        let start=((pageId-1)*10);
        let perPage=10;
        sqlcheck="SELECT id,carNo,carModelName,carType,rcBook from prayag_agent_cars where agentId=? order by Id desc limit ?,? ";   
           
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[agentId,start,perPage],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    },    
    addDriver:async(userId,firstName,lastName,mobileNo,email,licenseNo,licenseUrl)=>{
        sqlCars="select * from prayag_users where mobileNo='"+mobileNo+"'";
        
        return new Promise((resolve, reject)=>{
            pool.query(sqlCars,  (error, result)=>{
                //console.log("result==="+JSON.stringify(result));
                if(result.length>0){
                    return resolve({code:500,msg:"Car already added"});
                }else{
                    var insertDiver="INSERT INTO prayag_users (firstName, lastName,mobileNo,email,parentId,idProof,idNumber,userType,status) VALUES (?,?,?,?,?,?,?,?,?)";
                    data=[firstName,lastName,mobileNo,email,userId,licenseUrl,licenseNo,'driver','Active'];
                    pool.query(insertDiver, data, (error, resultData)=>{
                        if(error){
                            return reject(error);
                        }
                    });
                }
                
                
            });
            //return reject({code:500,msg:"some thing went wrong"});
        });
        
    },    
    getDrivers:async(userId,pageId)=>{
        let start=((pageId-1)*10);
        let perPage=10;
        sqlcheck="SELECT * from prayag_users where parentId=? and isDeleted='N' order by Id desc limit ?,? ";   
           
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[userId,start,perPage],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    },   
    searchDriver:async(mobile)=>{
        sqlcheck="SELECT * from prayag_users where mobileNo=? and isDeleted='N' and userType='driver' order by Id desc ";  
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[mobile],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    },   
    searchCar:async(carNo)=>{
        sqlcheck="SELECT * from prayag_agent_cars where carNo=? and isDeleted='N' order by Id desc ";   
           
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[carNo],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    },    
    assignBookingCar:async(agentId,carId,modelName,carNo,carType,bookingId)=>{
        modelName=carType+" "+modelName;
        updateSql="update prayag_booking set carId='"+carId+"',gadiNo='"+carNo+"',gadiModel='"+modelName+"'  where orderId='"+bookingId+"'";
        console.log(updateSql);           
        return new Promise((resolve, reject)=>{
            pool.query(updateSql,[],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    },    
    assignBookingDriver:async(agentId,driverId,driverName,mobileNo,bookingId,contactNo)=>{
        updateSql="update prayag_booking set driverName='"+driverName+"',driverContact='"+mobileNo+"',driverId='"+driverId+"' where orderId='"+bookingId+"'";
        console.log(updateSql);  
        return new Promise((resolve, reject)=>{
            pool.query(updateSql,[],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
    },    
    
}