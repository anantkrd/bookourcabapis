const pool=require('../../config/database');
var request = require('request');
const moment = require('moment');
module.exports={
    create:async(data)=>{
        let returndate=data.returnDate;
        if(returndate==null || returndate==""){
            returndate='0000-00-00 00:00:00';
        }
        sqlBooking="INSERT INTO prayag_booking (userId,userName,orderId,cabId,pickup,destination,pickupDate,returnDate,isReturn,pickupLat,pickupLong,destinationLat,destinationLong,distance,journyTime,rate,amount,discount,finalAmount,payment_orderId,status,pickupCityName,pickupDistrict,pickupState,dropCityName,dropDistrict,dropState,userMobileNo) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        booking=[data.userId,data.userName,data.orderId,data.cabId,data.pickup,data.destination,data.pickupDate,returndate,data.isReturn,data.pickupLat,data.pickupLong,data.destinationLat,data.destinationLong,data.distance,data.journyTime,data.rate,data.amount,data.discount,data.finalAmount,data.payment_orderId,data.status,
            data.pickupCityName,data.pickupDistrict,data.pickupState,data.dropCityName,data.dropDistrict,data.dropState,data.mobileNo];
        console.log("sqlBookin==="+sqlBooking);
        
        console.log("booking===="+JSON.stringify(booking));
        
        return new Promise((resolve, reject)=>{
            pool.query(sqlBooking, booking, (error, elements)=>{
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });

        /*pool.query(sqlBooking,booking,(err,results,fields)=>{
            if(err){
                return callBack(err);
            }else{
                return callBack(null,results);
            }
        });*/
    },
    createSearchLog:(data,callBack)=>{
        let returndate=data.returnDate;
        console.log("===========================In Log===============");
        if(returndate==null || returndate==""){
            returndate='0000-00-00 00:00:00';
        }
        sqlBooking="INSERT INTO prayag_search_log (mobileNo, pickup,destination,pickupDate,returnDate,pickupLat,pickupLong,destinationLat,destinationLong,distance,journyTime,isDeleted,sedan,luxury,compact) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        booking=[data.mobileNo,data.pickup,data.destination,data.pickupDate,returndate,data.pickupLat,data.pickupLong,data.destinationLat,data.destinationLong,data.distance,data.journyTime,'N',data.sedanRate,data.luxuryRate,data.compactRate];
        sqlBooking1="INSERT INTO prayag_search_log (mobileNo, pickup,destination,pickupDate,returnDate,pickupLat,pickupLong,destinationLat,destinationLong,distance,journyTime,isDeleted)  VALUES ("+data.mobileNo+","+data.pickup+","+data.destination+","+data.pickupDate+","+data.returnDate+","+data.pickupLat+","+data.pickupLong+","+data.destinationLat+","+data.destinationLong+","+data.distance+","+data.journyTime+",'N')";
        
        console.log("sqlBooking=="+sqlBooking1+"******");
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
        
        console.log("sendSms=="+JSON.stringify(sendSms));
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
    getSurge:async(cityName,location='',callBack)=>{
        sql="SELECT * FROM `prayag_surge` WHERE `city` LIKE '"+cityName+"' and isDeleted='N'";
        console.log("SQL=="+sql);
        return new Promise((resolve, reject)=>{
            pool.query(sql,  (error, elements)=>{
                console.log("errorerror==="+elements)
                if(elements=='' || elements.length<=0){
                    console.log("No elements")
                    let json=[{"city":"Pune","surge":'{"Compact":1,"Sedan":1,"Luxury":1,"SUVErtiga":1,"Innova":1,"InnovaCrysta":1,"other":1,"local":20}'}]
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
        let rawResponcedata=JSON.stringify(rawResponce);
        let resData= JSON.stringify({code:'200',msg:'success',data:''});
        return new Promise((resolve, reject)=>{
            pool.query(sqlGetPay, async(error, result)=>{
                console.log("result==="+JSON.stringify(result));
                bookingAmount=result[0]['amount'];
                sqlUpdatePayment="UPDATE `prayag_booking_payment` SET `status`='completed',rawResponce='"+rawResponcedata+"' WHERE paymentId='"+razorpayOrderId+"'";
                pool.query(sqlUpdatePayment,  (error, elements)=>{                
                });
                sqlUpdateBooking="UPDATE `prayag_booking` SET `paid`='"+bookingAmount+"',`status`='waiting' WHERE payment_orderId='"+razorpayOrderId+"'";
                pool.query(sqlUpdateBooking,  (error, elements)=>{
                
                });
                console.log("sqlUpdatePayment=="+sqlUpdatePayment);
                console.log("sqlUpdateBooking=="+sqlUpdateBooking);
                let sendSms=await module.exports.sentBookingSmsToCustomer(razorpayOrderId);
                return resolve(resData);
            });
            return resolve(resData);
        });
    },
    sentBookingSmsToCustomer:async(razorpayOrderId)=>{
        sqlGetPay="select * from prayag_booking where payment_orderId='"+razorpayOrderId+"'";
        console.log("sqlGetPay=="+sqlGetPay);
        //let rawResponcedata=JSON.stringify(rawResponce);
        let resData= JSON.stringify({code:'200',msg:'success',data:''});
        return new Promise((resolve, reject)=>{
            pool.query(sqlGetPay,  async(error, result)=>{
                console.log("result booking query==="+JSON.stringify(result));
                userMobileNo=result[0]['userMobileNo'];
                userName=result[0]['userName'];
                pickup=result[0]['pickup'];
                destination=result[0]['destination'];
                let pickupCityName=pickup.split(",")[0];
                let dropCityName=destination.split(",")[0];
                pickupDate='';
                if(result[0]['pickupDate']!=''){
                    pickupDate=result[0]['pickupDate'];
                    pickupDate=moment(pickupDate).format('llll');
                }
                
                returnDate='';
                if(result[0]['returnDate']!=''){
                    returnDate=result[0]['returnDate'];
                    returnDate=moment(returnDate).format('llll');
                }
                orderId=result[0]['orderId'];
                var msg='Thank You For booking with Bookourcar, '+userName+' here is your trip details Pickup : '+pickupCityName+' Drop : '+dropCityName+' On '+pickupDate;
                //var url='http://nimbusit.biz/api/SmsApi/SendSingleApi?UserID=anantkrd&Password=snra7522SN&SenderID=ANANTZ&Phno='+mobileNo+'&Msg='+encodeURIComponent(msg);
                let url="http://servermsg.com/api/SmsApi/SendSingleApi?UserID=Anant&Password=ptpq6277PT&SenderID=BKOCAR&Phno=7722055354&Msg="+encodeURIComponent(msg)+"&EntityID=BookOurCar&TemplateID=BookSMSTOCustomer";
                   //console.log(url); 
                   //let resOtp=await module.exports.expireOtp(mobileNo);
                  await request.get({ url: url },      function(error, response, body) {
                    //console.log("SMs Res: "+JSON.stringify(response));
                    if (!error && response.statusCode == 200) {
                        console.log("==otp sent=="+JSON.stringify(response));
                       }
                   });
                return resolve(resData);
            });
            return resolve(resData);
        });
    }
}