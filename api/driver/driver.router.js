const express=require('express');
const jwt=require('jsonwebtoken');
const{createUser,getUserByMobile}=require('../user/user.controller');
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
router.get('/get_payment_report',async function(req,res,next){
    results =await getPaymentReport(req.query.userId,req.query.pageId);
    console.log("result="+JSON.stringify(results))
    if(results.length<=0){
        responce=JSON.stringify({code:'500',msg:'some internal error',data:''});
    }else{
        responce=JSON.stringify({code:'200',msg:'',data:results});
    }
    res.send(responce);
});
router.get('/get_trip_report',async function(req,res,next){
    results =await getbookingReport(req.query.userId,req.query.pageId);
    console.log("result="+JSON.stringify(results))
    if(results.length<=0){
        responce=JSON.stringify({code:'500',msg:'some internal error',data:''});
    }else{
        responce=JSON.stringify({code:'200',msg:'',data:results});
    }
   
    res.send(responce);
});
module.exports=router;