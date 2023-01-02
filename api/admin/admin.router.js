var express = require('express');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');
var router = express.Router();
const {getBookingsAdminHome,updateAgentAmount,getWaitingForAgentBooking,getCompletedBookings,getReadyBooking,getConfirmBooking,
    getAgents}=require('./admin.controller');
const{addPaymentAgent,updateBookingDetails,assignAggent,addSurge,addCab,getSurge,getCab}=require('./admin.service');
const { json } = require('body-parser');
const authenticate=require("../auth/index");
var distance = require('google-distance-matrix');
const Razorpay = require("razorpay");
/*const authenticate=function(req,res,next){
    console.log("Here is in auth");
    jwt.verify();
    next();
}*/

router.get('/get_booking_admin',authenticate, async function(req, res, next) {
    resultsdata =await getBookingsAdminHome(req.query.pageId);
    resultsdata=JSON.parse(resultsdata);
    //console.log("results=====results===******"+JSON.stringify(resultsdata));
            dataObj=[];
            let results=resultsdata.results;
            let rowCount=resultsdata.rowCount;
            let totalPage=Math.ceil(resultsdata.totalPage);
            if(results.length<=0){
                responce=JSON.stringify({code:'500',msg:'some internal error',data:''});
            }else{
                for ( var i = 0; i < results.length; i++)
                {
                    id=results[i]['id'];
                    userId=results[i]['userId'];
                    userName=results[i]['userName'];
                    bookingId=results[i]['orderId'];
                    cabId=results[i]['cabId'];
                    pickup=results[i]['pickup'];   
                    destination=results[i]['destination'];   
                    pickupDate=results[i]['pickupDate'];   
                    returnDate=results[i]['returnDate'];   
                    isReturn=results[i]['isReturn'];   
                    pickupLat=results[i]['pickupLat'];   
                    pickupLong=results[i]['pickupLong'];   
                    destinationLat=results[i]['destinationLat'];   
                    destinationLong=results[i]['destinationLong'];   
                    distance=results[i]['distance'];   
                    journyDistance=results[i]['journyDistance'];   
                    journyTime=results[i]['journyTime'];   
                    amount=results[i]['amount'];           
                    discount=results[i]['discount'];           
                    extraRate=results[i]['extraRate'];           
                    extraAmount=results[i]['extraAmount'];           
                    tax=results[i]['tax'];           
                    charges=results[i]['charges'];           
                    finalAmount=results[i]['finalAmount'];   
                    paid=results[i]['paid'];   
                    pending=results[i]['pending'];   
                    payment_orderId=results[i]['payment_orderId'];   
                    agentId=results[i]['agentId'];   
                    agentPrice=results[i]['agentPrice'];   
                    driverName=results[i]['driverName'];   
                    driverContact=results[i]['driverContact'];                
                    //console.log("ID: " + id);
                    gadiNo=results[i]['gadiNo'];                        
                    image=results[i]['image'];
                    cabType=results[i]['cabType'];
                    ac=results[i]['ac'];
                    bags=results[i]['bags'];
                    cars=results[i]['cars'];
                    capacity=results[i]['capacity'];
                    note=results[i]['note'];
                    
                    mobileNo=results[i]['mobileNo'];
                    rate=results[i]['rate'];
                    dataObj1={};
                    dataObj1['id']=id;
                    dataObj1['bookingId']=bookingId;
                    dataObj1['userName']=userName;
                    dataObj1['mobileNo']=mobileNo;
                    dataObj1['pickup']=pickup;
                    dataObj1['destination']=destination;
                    dataObj1['pickupDate']=pickupDate;
                    dataObj1['returnDate']=returnDate;
                    dataObj1['finalAmount']=finalAmount;
                    dataObj1['agentPrice']=agentPrice;
                    dataObj1['cabType']=cabType;
                    dataObj1['image']=image;
                    dataObj1['ac']=ac;
                    dataObj1['bags']=bags;
                    dataObj1['cars']=cars;
                    dataObj1['capacity']=capacity;
                    dataObj1['note']=note;
                    dataObj1['amount']=amount;
                    dataObj1['paid']=paid;
                    dataObj1['pending']=amount-paid;
                    dataObj1['journyTime']=journyTime;
                    dataObj1['discountAmount']=discount;
                    dataObj1['rate']=rate;
                    dataObj1['agentId']=agentId;
                    dataObj1['driverName']=driverName;
                    dataObj1['driverContact']=driverContact;
                    dataObj1['gadiNo']=gadiNo;
                    //dataObj1['originlng']=originlng;
                    dataObj.push(dataObj1);
                }
                
                responce=JSON.stringify({code:'200',msg:'',data:dataObj,pageId:req.query.pageId,rowCount:rowCount,totalPage:totalPage});
            }
    res.send(responce); 
    /*res1=getBookings(req.query.userId,1,(err,results)=>{
        if(err){
            responce=JSON.stringify({code:'501',error:'user not found',data:''});
        }else{            
            console.log("last inserted id="+results);
            responce=JSON.stringify({code:'200',msg:'',data:results});
        }
        res.send(responce);
    });*/
  });

router.get('/get_completed_bookings',authenticate,async function(req,res,next){
    results =await getCompletedBookings(req.query.userId,req.query.pageId);
    //console.log("result="+JSON.stringify(results))
   
    res.send(results);
});
router.get('/get_ready_booking',authenticate,async function(req,res,next){
    results =await getReadyBooking(req.query.userId,req.query.pageId);
    console.log("result="+JSON.stringify(results))
   
    res.send(results);
});
router.get('/get_confirms_booking',authenticate,async function(req,res,next){
    results =await getConfirmBooking(req.query.userId,req.query.pageId);
    console.log("result="+JSON.stringify(results))
   
    res.send(results);
});
router.get('/get_waiting_agent_bookings',authenticate,async function(req,res,next){
    results =await getWaitingForAgentBooking(req.query.userId,req.query.pageId);
    console.log("result="+JSON.stringify(results))
   
    res.send(results);
});  

router.get('/update_agent_amount',authenticate,async function(req,res,next){
    results =await updateAgentAmount(req.query.amount,req.query.bookingId);
    res.send(results);
});  
router.get('/get_agent',authenticate, async function(req, res, next) {
    result =await getAgents(req.query.userId);
    if(result.length<=0){
        responce=JSON.stringify({code:'501',message:'user not found',data:''});
    }else{
        responce=JSON.stringify({code:'200',message:'',data:result});
    }
    res.send(responce);
    
  });

router.get('/assign_agent',authenticate,async function(req,res,next){
    results =await assignAggent(req.query.agentId,req.query.bookingId);
    
    if(results.length<=0){
        responce=JSON.stringify({code:'500',msg:'No Data found',data:''});
    }else{
        
        responce=JSON.stringify({code:'200',msg:'Agent assined successfully',data:''});
    }
     //return responce; 
    res.send(responce);
});  

router.post('/add_surge',authenticate,async function(req,res,next){
    
    results =await addSurge(req.body.userId,req.body.city,req.body.surgeData);
    console.log("****************result="+JSON.stringify(results));  
    if(results.length<=0){
        responce=JSON.stringify({code:'500',msg:'No Data found',data:''});
    }else{
        
        responce=JSON.stringify({code:'200',msg:'Agent assined successfully',data:''});
    }
     //return responce; 
    res.send(responce);
});

router.post('/add_cab',authenticate,async function(req,res,next){
    
    results =await addCab(req.body.userId,req.body);
    if(results.length<=0){
        responce=JSON.stringify({code:'500',msg:'No Data found',data:''});
    }else{
        
        responce=JSON.stringify({code:'200',msg:'Agent assined successfully',data:''});
    }
     //return responce; 
    res.send(responce);
});

router.get('/get_surge',authenticate,async function(req,res,next){
    
    results =await getSurge(req.query.userId);
    console.log("****************result="+JSON.stringify(results));  
    if(results.length<=0){
        responce=JSON.stringify({code:'500',msg:'No Data found',data:''});
    }else{        
        responce=JSON.stringify({code:'200',msg:'successfully',data:results});
    }
     //return responce; 
    res.send(responce);
});

router.get('/get_cab',authenticate,async function(req,res,next){
    
    results =await getCab(req.query.userId);
    if(results.length<=0){
        responce=JSON.stringify({code:'500',msg:'No Data found',data:''});
    }else{
        
        responce=JSON.stringify({code:'200',msg:'successfully',data:results});
    }
     //return responce; 
    res.send(responce);
});
/*
router.get('/update_agent_amount',authenticate, async function(req, res, next) {
    console.log("in update route")
    //results =await updateAgentAmount(req.query.amount,req.query.bookingId);
    res.send();
  });*/
module.exports=router;