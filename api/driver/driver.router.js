const express=require('express');
const jwt=require('jsonwebtoken');
const{startTrip,endTrip}=require('../driver/driver.controller');
const {}=require('./driver.controller');
const{getMyBookings,getbookingReport,getPaymentReport}=require('./driver.service');


const authenticate=require("../auth/index");
const router=express.Router();
var distance = require('google-distance-matrix');
const Razorpay = require("razorpay");

router.get('/get_my_trip',authenticate,async function(req,res,next){
    results =await getMyBookings(req.query.userId,req.query.pageId);
    console.log("result="+JSON.stringify(results))
    if(results.length<=0){
        responce=JSON.stringify({code:'500',msg:'some internal error',data:''});
    }else{
        responce=JSON.stringify({code:'200',msg:'',data:results});
    }
    res.send(responce);
});
router.get('/get_payment_report',authenticate,async function(req,res,next){
    results =await getPaymentReport(req.query.userId,req.query.pageId);
    console.log("result="+JSON.stringify(results))
    if(results.length<=0){
        responce=JSON.stringify({code:'500',msg:'some internal error',data:''});
    }else{
        responce=JSON.stringify({code:'200',msg:'',data:results});
    }
    res.send(responce);
});
router.get('/get_trip_report',authenticate,async function(req,res,next){
    results =await getbookingReport(req.query.userId,req.query.pageId);
    console.log("result="+JSON.stringify(results))
    if(results.length<=0){
        responce=JSON.stringify({code:'500',msg:'some internal error',data:''});
    }else{
        responce=JSON.stringify({code:'200',msg:'',data:results});
    }
   
    res.send(responce);
});
router.get('/start_trip',authenticate,async function(req,res,next){
    results =await startTrip(req.query.userId,req.query.bookingId,req.query.startkm);
    console.log("result="+JSON.stringify(results))
    if(results.length<=0){
        responce=JSON.stringify({code:'500',msg:'some internal error',data:''});
    }else{
        responce=JSON.stringify({code:'200',msg:'',data:results});
    }
   
    res.send(responce);
});
router.get('/end_trip',authenticate,async function(req,res,next){
    results =await endTrip(req.query.userId,req.query.bookingId,req.query.endKm);
    console.log("result="+JSON.stringify(results))
    if(results.length<=0){
        responce=JSON.stringify({code:'500',msg:'some internal error',data:''});
    }else{
        responce=JSON.stringify({code:'200',msg:'',data:results});
    }
   
    res.send(responce);
});
module.exports=router;