const pool=require('../../config/database');
module.exports={
    create:(data,callBack)=>{
        let returndate=data.returnDate;
        if(returndate==null || returndate==""){
            returndate='0000-00-00 00:00:00';
        }
        sqlBooking="INSERT INTO prayag_booking (userId,userName,orderId,cabId,pickup,destination,pickupDate,returnDate,isReturn,pickupLat,pickupLong,destinationLat,destinationLong,distance,journyTime,rate,amount,discount,finalAmount,payment_orderId,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        booking=[data.userId,data.userName,data.orderId,data.cabId,data.pickup,data.destination,data.pickupDate,returndate,data.isReturn,data.pickupLat,data.pickupLong,data.destinationLat,data.destinationLong,data.distance,data.journyTime,data.rate,data.amount,data.discount,data.finalAmount,data.payment_orderId,data.status];
        console.log("sqlBookin==="+sqlBooking);
        
        console.log("booking===="+JSON.stringify(booking));
        pool.query(sqlBooking,booking,(err,results,fields)=>{
            if(err){
                return callBack(err);
            }else{
                return callBack(null,results);
            }
        });
    },
    createSearchLog:(data,callBack)=>{
        sqlBooking="INSERT INTO prayag_search_log (mobileNo, pickup,destination,pickupDate,returnDate,pickupLat,pickupLong,destinationLat,destinationLong,distance,journyTime,isDeleted,sedan,luxury,compact) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        booking=[data.mobileNo,data.pickup,data.destination,data.pickupDate,returndate,data.pickupLat,data.pickupLong,data.destinationLat,data.destinationLong,data.distance,data.journyTime,'N',data.sedanRate,data.luxuryRate,data.compactRate];
        sqlBooking1="INSERT INTO prayag_search_log (mobileNo, pickup,destination,pickupDate,returnDate,pickupLat,pickupLong,destinationLat,destinationLong,distance,journyTime,isDeleted)  VALUES ("+data.mobileNo+","+data.pickup+","+data.destination+","+data.pickupDate+","+data.returnDate+","+data.pickupLat+","+data.pickupLong+","+data.destinationLat+","+data.destinationLong+","+data.distance+","+data.journyTime+",'N')";
        
        //console.log("sqlBooking=="+sqlBooking1+"******");
        //console.log("booking===="+JSON.stringify(booking));
        pool.query(sqlBooking,booking,(err,results,fields)=>{
            if(err){
                return callBack(err);
            }else{
                return callBack(null,results);
            }
        });
    },
    getCabs:async(data,callBack)=>{
        sql="select * from prayag_cabs where isDeleted='N'";
        return new Promise((resolve, reject)=>{
            pool.query(sql,  (error, elements)=>{
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });
        /*pool.query(sql,(err,results,fields)=>{
            if(err){
                return callBack(err);
            }else{
                console.log("results*="+JSON.stringify(results));
                return callBack(null,results);
            }
        });*/
    },    
    getSurge:async(cityName,callBack)=>{
        sql="SELECT city,compact,sedan,luxury,other FROM `prayag_surge` WHERE `city` LIKE '"+cityName+"' and isDeleted='N'";
        console.log("SQL=="+sql);
        return new Promise((resolve, reject)=>{
            pool.query(sql,  (error, elements)=>{
                console.log("errorerror==="+elements)
                if(elements=='' || elements.length<=0){
                    console.log("No elements")
                    let json=[{"city":"Pune","compact":1,"sedan":1,"luxury":1,"other":1}]
                    return resolve(json);
                }
                console.log(JSON.stringify(elements))
                return resolve(elements);
            });
        });
    },    
    addPayment:async(amount,bookingId,mobileNo,paymentId)=>{
        sql="INSERT INTO `prayag_booking_payment`(`bookingId`, `paymentId`, `mobileNo`, `amount`, `rawResponce`, `paymentType`, `status`, `isDeleted`) VALUES ('"+bookingId+"','"+paymentId+"','"+mobileNo+"','"+amount+"','','credit','pending','N')";
        console.log("SQL=="+sql);
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
        sqlGetPay="select * from prayag_booking_payment where paymentId='"+razorpayOrderId+"'";
        console.log("sqlGetPay=="+sqlGetPay);
        return new Promise((resolve, reject)=>{
            pool.query(sqlGetPay,  (error, result)=>{
                console.log("result==="+JSON.stringify(result));

                bookingAmount=result[0]['amount'];
                sqlUpdatePayment="UPDATE `prayag_booking_payment` SET `status`='completed',rawResponce='"+rawResponce+"' WHERE paymentId='"+razorpayOrderId+"'";
                pool.query(sqlUpdatePayment,  (error, elements)=>{                
                });
                sqlUpdateBooking="UPDATE `prayag_booking` SET `paid`='"+bookingAmount+"',`status`='waiting' WHERE payment_orderId='"+razorpayOrderId+"'";
                pool.query(sqlUpdateBooking,  (error, elements)=>{
                
                });
                console.log("sqlUpdatePayment=="+sqlUpdatePayment);
                console.log("sqlUpdateBooking=="+sqlUpdateBooking);
                return resolve();
            });
            return resolve();
            
            
            
        });
    },

}