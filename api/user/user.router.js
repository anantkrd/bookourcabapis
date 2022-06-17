var express = require('express');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');
var router = express.Router();
const{createUser,getUserByMobile,sendOTP,verifyOtp,getBookings,getBookingByUser,getBookingById,
    getBookingSearchLog,getUserByID}=require('./user.controller');
const { json } = require('body-parser');
const authenticate=require("../auth/index");

/* GET home page. */
//router.get('/create_user', createUser);
router.get('/create_user', async function(req, res, next) {
    
    res1=createUser(req.query.fname,req.query.lname,req.query.mobileNo,req.query.email,(err,results)=>{
        if(err){
            responce=JSON.stringify({code:'501',error:err,data:''});
        }else{
            console.log("last inserted id="+results.insertId);
            responce=JSON.stringify({code:'200',msg:'user added',data:results.insertId});
        }
        res.send(responce);
    });  
    
  });
  router.get('/get_user_byid', authenticate,async function(req, res, next) {
    console.log("In get_user_byid")
    res1=getUserByID(req.query.userId,(err,results)=>{
        console.log("===resultsUser *****==="+JSON.stringify(results));
        if(err){
            responce=JSON.stringify({code:'501',error:err,data:''});
        }else{
            console.log("last inserted id="+results);
            responce=JSON.stringify({code:'200',msg:'',data:results});
        }
        res.send(responce);
    }); 
    
  });
  router.get('/get_user', async function(req, res, next) {
    
    res1=getUserByMobile(req.query.mobileNo,(err,results)=>{
        if(err){
            responce=JSON.stringify({code:'501',error:err,data:''});
        }else{
            console.log("last inserted id="+results);
            responce=JSON.stringify({code:'200',msg:'',data:results});
        }
        res.send(responce);
    }); 
    
  });
  
  router.get('/send_otp', async function(req, res, next) {
      console.log("api mobileNo**"+req.query.mobileNo)
    responce =await sendOTP(req.query.mobileNo);
    //const data = await responce.json();
    console.log(responce.code+"api responce**"+JSON.stringify(responce));
    /*if(responce.code==200){        
        responce=JSON.stringify({code:'200',msg:'',data:responce.data});        
    }else{
        responce=JSON.stringify({code:'501',error:"User Not Found",data:''});
    }*/
    res.send(responce);
    /*res1=sendOTP(req.query.mobileNo,(err,results)=>{
        if(err){
            responce=JSON.stringify({code:'501',error:'user not found',data:''});
        }else{
            
            console.log("last inserted id="+results);
            responce=JSON.stringify({code:'200',msg:'',data:results});
        }
        res.send(responce);
    }); */
    
  });
  router.get('/verify_otp', async function(req, res, next) {
    responce =await verifyOtp(req.query.mobileNo,req.query.otp);
    res.send(responce);
    /*res1=verifyOtp(req.query.mobileNo,req.query.otp,(err,results)=>{
        if(err){
            responce=JSON.stringify({code:'501',error:'user not found',data:''});
        }else{            
            //console.log(results[0]['id']+"last inserted id="+JSON.stringify(results));
            const token= jwt.sign({ id: results[0]['id'] }, process.env.secrete);
            //console.log("token=="+token);
            results[0]['token']=token;
            responce=JSON.stringify({code:'200',msg:'',data:results});
        }
        res.send(responce);
    }); */
    
  });
  
  router.get('/get_booking',authenticate, async function(req, res, next) {
    result =await getBookings(req.query.pageId);
    if(result.length<=0){
        responce=JSON.stringify({code:'501',message:'user not found',data:''});
    }else{
        responce=JSON.stringify({code:'200',message:'',data:result});
    }
    res.send(responce);
    
  });
  
  router.get('/get_user_booking',authenticate, async function(req, res, next) {
    responce =await getBookingByUser(req.query.userId);
    res.send(responce);
    /*res1=getBookingByUser(req.query.userId,(err,results)=>{
        if(err){
            responce=JSON.stringify({code:'501',error:'user not found',data:''});
        }else{            
            //console.log("last inserted id="+results);
            responce=JSON.stringify({code:'200',msg:'',data:results});
        }
        res.send(responce);
    }); */
    
  });
  
  router.get('/get_booking_details',authenticate, async function(req, res, next) { 
    responce =await getBookingById(req.query.bookingId);
    res.send(responce);   
    /*res1=getBookingById(req.query.bookingId,(err,results)=>{
        if(err){
            responce=JSON.stringify({code:'501',error:'user not found',data:''});
        }else{            
            console.log("last inserted id="+results);
            responce=JSON.stringify({code:'200',msg:'',data:results});
        }
        res.send(responce);
    });     */
  });
  router.get('/get_search_log',authenticate, async function(req, res, next) {   
     
    results =await getBookingSearchLog(req.query.userId,1);
    //res.send(results);
    if(results.length<=0){
        responce=JSON.stringify({code:'500',msg:'some internal error',data:''});
        
    }else{
        responce=JSON.stringify({code:'200',msg:'agent create successfully',data:results});
    }
    res.send(responce);  
    /*res1=getBookingSearchLog(req.query.userId,1,(err,results)=>{
        if(err){
            responce=JSON.stringify({code:'501',error:'user not found',data:''});
        }else{            
            console.log("last inserted id="+results);
            responce=JSON.stringify({code:'200',msg:'',data:results});
        }
        res.send(responce);
    }); */  
  });

  router.get('/register', async function(req, res, next) { 
    resultUser=await getUserByMobile(req.query.mobileNo);
    if(resultUser.length<=0){
        results=await createUser(req.query.fname,req.query.lname,req.query.mobileNo,req.query.email,req.query.type);
        console.log("==results=="+JSON.stringify(results));
        if(results.length<=0){
            responce=JSON.stringify({code:'500',msg:'some internal error',data:''});
        }else{
            responce=JSON.stringify({code:'200',msg:'agent create successfully',data:results});
        }
    }else{
        responce=JSON.stringify({code:'500',msg:'User already registered',data:''});
    }
    res.send(responce);   
  });
module.exports = router;

