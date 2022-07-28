const { PayloadTooLarge } = require("http-errors");
const pool=require("../../config/database");
var http = require('http');
var request = require('request');
var AWS = require('aws-sdk');


module.exports={
    create:async(data,callBack)=>{
        sqlcheck="select * from prayag_users where mobileNo=?";
        var sql="INSERT INTO prayag_users (firstName, lastName,mobileNo,email,userType,status) VALUES (?,?,?,?,?,?)";
        //users=[[fName,lName,mobileNo,email,'Active']];
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[data.mobileNo],  (error, results)=>{
                if(results.length>0){
                    let json={code:401,msg:'user already exist'}
                    return reject(json);
                }else{
                    pool.query(sql,[data.fname,data.lname,data.mobileNo,data.email,data.type,'Active'],  (error, results)=>{
                        if(error){
                            return reject(error);
                        }
                        if(data.type=='agent'){
                            let insertId=results.insertId;
                            var agentAdd="INSERT INTO prayag_agent_detials (agentId) VALUES (?)";
                            pool.query(agentAdd,[insertId],(errdata,resultdata)=>{            
                                
                            }) 
                        }
                        return resolve(results);
                    });
                }
               
            });
        });
        /*pool.query(sql,[data.fname,data.lname,data.mobileNo,data.email,'Active'],(err,result,fields)=>{
            if(err)return callBack(err);
            return callBack(null,result);
        })*/
    },
    
    getUserByMobile:async (mobileNo)=>{
        sqlcheck="select id,firstName,lastName,mobileNo,email,userType,createdTime from prayag_users where mobileNo=?";
        //console.log("select id,firstName,lastName,mobileNo,email,userType,createdTime from prayag_users where mobileNo="+mobileNo)
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[mobileNo],  (error, results)=>{
                if(error){
                    console.log("error=="+error);
                    return reject(error);
                }
                return resolve(results);
            });
        });
    },
    getUserByID:async (userId)=>{
        sqlcheck="select id,firstName,lastName,mobileNo,email,userType,createdTime,idProof,idNumber,profileImage from prayag_users where id=?";
        //console.log("select id,firstName,lastName,mobileNo,email,userType,idProof,idNumber,profileImage,createdTime from prayag_users where id="+userId)
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[userId],  (error, results)=>{
                if(error){
                    console.log("error=="+error);
                    return reject(error);
                }
                
                return resolve(results);
            });
        });
    },
    sendOTP:async(mobileNo)=>{
        let otp=Math.round(Math.random() * (9999 -1000 ) + 1000);
        var msg='your otp to login with prayag tourse & travels is '+otp;
        var url='http://nimbusit.biz/api/SmsApi/SendSingleApi?UserID=anantkrd&Password=snra7522SN&SenderID=ANANTZ&Phno='+mobileNo+'&Msg='+encodeURIComponent(msg);
           //console.log(url); 
           let resOtp=await module.exports.expireOtp(mobileNo);
          await request.get({ url: url },      function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("==otp sent=="+JSON.stringify(response));
               }
           });
             
        var sql="INSERT INTO prayag_otp (mobileNo, otp) VALUES (?,?)";
        return new Promise((resolve, reject)=>{
            pool.query(sql,[mobileNo,otp],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
        /*pool.query(sql,[mobileNo,otp],(err,result,fields)=>{
            if(err)return callBack(err);
            return callBack(null,result);
        })*/
    },
    expireOtp:async(mobileNo)=>{
        var sqlUpdate="update prayag_otp set isExpired='Y' where mobileNo=? and isExpired='N' and verified='N' and isDeleted='N'";
        return new Promise((resolve, reject)=>{
            pool.query(sqlUpdate,[mobileNo],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        }); 
    },
    verifyOtp:async(mobileNo,otp)=>{        
        let resOtpCount=await module.exports.validateOtp(mobileNo);
        
        let resOtp=await module.exports.updateAttempt(mobileNo);
        console.log("resOtpCount=="+JSON.stringify(resOtpCount));
        
        sqlcheck="select * from prayag_otp where mobileNo=? and otp=? and isExpired='N' and verified='N' order by id desc limit 1";
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[mobileNo,otp],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
        /*pool.query(sqlcheck,[mobileNo,otp],(err,result,fields)=>{
            if(err){
                return callBack(err);
            }else{
                var sqlUpdate="update prayag_otp set verified='Y' where mobileNo=? and otp=?";
                pool.query(sqlUpdate,[mobileNo,otp],(err,result,fields)=>{            
                    
                });   
                return callBack(null,result);
            }            
        })*/
    },    
    updateAttempt:async(mobileNo)=>{
        var sqlUpdate="update prayag_otp set attempt=attempt+1 where mobileNo=? and isExpired='N' and verified='N'";
                    console.log(sqlUpdate+"=resOtp=="+mobileNo);
        return new Promise((resolve, reject)=>{
            pool.query(sqlUpdate,[mobileNo],  (error, results)=>{
                if(error){
                    
                    return reject(error);
                }
                return resolve(results);
            });
        });
    },
    validateOtp:async(mobileNo)=>{
        sqlcheck="select attempt from prayag_otp where mobileNo=? and isExpired='N' and verified='N' order by id desc";
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[mobileNo],  (error, results)=>{
                if(error){                    
                    return reject(error);
                }
                return resolve(results);
            });
        });
    },
    getBookingById:async(orderId,callBack)=>{
        sqlcheck="SELECT booking.*,cabs.cabType,cabs.ac,cabs.bags,cabs.capacity,cabs.cars,cabs.note ,(select mobileNo from prayag_users where id=booking.userId ) as mobileNo FROM `prayag_booking` booking inner JOIN prayag_cabs cabs ON booking.cabId=cabs.id WHERE booking.orderId=? limit 1";
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[orderId],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
       /* pool.query(sqlcheck,[orderId],(err,result)=>{
            if(err){
                return callBack(err);
            }else{
                return callBack(null,result);
            }
        })*/
    },    
    getBookingByUser:async(userId,callBack)=>{
        sqlcheck="SELECT booking.*,cabs.cabType,cabs.ac,cabs.bags,cabs.capacity,cabs.cars,cabs.note FROM `prayag_booking` booking inner JOIN prayag_cabs cabs ON booking.cabId=cabs.id WHERE booking.userId=? and booking.isDeleted='N' ORDER by booking.id desc";
        //console.log("sqlcheck=="+sqlcheck)
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[userId],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
        /*pool.query(sqlcheck,[userId],(err,result)=>{
            if(err){
                return callBack(err);
            }else{
                return callBack(null,result);
            }
        })*/
    },    
    getBookings:(pageId,callBack)=>{
        let start=((pageId-1)*10);
        let perPage=10;
        sqlcheck="SELECT booking.*,cabs.cabType,cabs.ac,cabs.bags,cabs.capacity,cabs.cars,cabs.note,(select mobileNo from prayag_users where id=booking.userId ) as mobileNo FROM `prayag_booking` booking inner JOIN prayag_cabs cabs ON booking.cabId=cabs.id WHERE booking.isDeleted='N' order by booking.id desc limit ?,?";
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[start,perPage],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        })
        /*pool.query(sqlcheck,[start,perPage],(err,result)=>{
            if(err){
                return callBack(err);
            }else{
                return callBack(null,result);
            }
        })*/
    },
    
    getBookingSearchLog:async(userId,pageId)=>{
        let start=((pageId-1)*10);
        let perPage=10;
        sqlcheck="SELECT * from prayag_search_log where isDeleted='N' order by id desc limit ?,?";
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[start,perPage],  (error, results)=>{
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        })
    },
    
    getAgentByID:async (userId)=>{
        sqlcheck="select * from prayag_agent_detials where agentId=?";
        console.log("select * from prayag_agent_detials where agentId="+userId)
        return new Promise((resolve, reject)=>{
            pool.query(sqlcheck,[userId],  (error, results)=>{
                if(error){
                    console.log("error=="+error);
                    return reject(error);
                }
                
                return resolve(results);
            });
        });
    },
    sendSms:async(userId,message,mobileNo)=>{
        let insertSms=""
    }
};
