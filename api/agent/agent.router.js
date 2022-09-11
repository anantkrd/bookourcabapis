const express=require('express');
const jwt=require('jsonwebtoken');
const{createUser,getUserByMobile}=require('../user/user.controller');
const {getBookingsForAgent,getMyBookings,getMyCompletedBookings}=require('./agent.controller');
const{getSurge,addPayment,}=require('../booking/booking.service');
const{addPaymentAgent,updateBookingDetails,addCar,getCars,addDriver,getDrivers,searchCar,searchDriver,assignBookingCar,assignBookingDriver,
    isCarAssign}=require('./agent.service');
const {authenticate}=require('../auth/index');
const router=express.Router();
var distance = require('google-distance-matrix');
const Razorpay = require("razorpay");

router.get('/get_booking_agent',async function(req,res,next){
    results =await getBookingsForAgent(req.query.userId,req.query.pageId);
    console.log("result="+JSON.stringify(results))
   
    res.send(results);
});
router.get('/get_my_bookings',async function(req,res,next){
    results =await getMyBookings(req.query.userId,req.query.pageId);
    console.log("result="+JSON.stringify(results))
   
    res.send(results);
});
router.get('/get_my_completed_bookings',async function(req,res,next){
    results =await getMyCompletedBookings(req.query.userId,req.query.pageId);
    console.log("result="+JSON.stringify(results))
   
    res.send(results);
});

router.get('/search_car',async function(req,res,next){
    results =await searchCar(req.query.carno);
    console.log("result="+JSON.stringify(results))
    if(results.length<=0){
        responce=JSON.stringify({code:'500',msg:'No data found',data:''});
    }else{
        responce=JSON.stringify({code:'200',msg:'',data:results});
    }
    res.send(responce);
});

router.get('/search_driver',async function(req,res,next){
    results =await searchDriver(req.query.driverMobile);
    console.log("result="+JSON.stringify(results))
    if(results.length<=0){
        responce=JSON.stringify({code:'500',msg:'No data found',data:''});
    }else{
        responce=JSON.stringify({code:'200',msg:'',data:results});
    }
    res.send(responce);
});
router.get('/add_car',async function(req,res,next){
    results =await addCar(req.query.userId,req.query.carModelNo,req.query.carNo,req.query.carType,req.query.rcBook);
    console.log("****************result="+JSON.stringify(results))
   
    res.send(results);
});
router.get('/get_cars',async function(req,res,next){
    results =await getCars(req.query.userId,req.query.pageId);
    if(results.length<=0){
        responce=JSON.stringify({code:'500',msg:'No data found',data:''});
    }else{
        responce=JSON.stringify({code:'200',msg:'',data:results});
    }   
    res.send(responce);
});

router.post('/assign_booking_car',async function(req,res,next){
    
    results =await assignBookingCar(req.body.agentId,req.body.carId,req.body.modelName,req.body.carNo,req.body.carType,req.body.bookingId);
    if(results.length<=0){
        responce=JSON.stringify({code:'500',msg:'No data found',data:''});
    }else{
        responce=JSON.stringify({code:'200',msg:'driver added successfully',data:''});
    }   
    res.send(responce);
});

router.post('/assign_booking_driver',async function(req,res,next){
    console.log("req.body.bookingId=="+req.body.bookingId);
    checkCar=await isCarAssign(req.body.bookingId);
    console.log("checkCar=="+JSON.stringify(checkCar));

    if(checkCar.carId>0){
        results =await assignBookingDriver(req.body.agentId,req.body.driverId,req.body.driverName,req.body.mobileNo,req.body.bookingId,req.body.contactNo);
        if(results.length<=0){
            responce=JSON.stringify({code:'500',msg:'No data found',data:''});
        }else{
            responce=JSON.stringify({code:'200',msg:'Car added successfully',data:''});
        }   
    }else{
        responce=JSON.stringify({code:'403',msg:'Please assign car first',data:''});
    }
    
    res.send(responce);
});

router.post('/add_driver',async function(req,res,next){
    
    results =await addDriver(req.body.userId,req.body.firstName,req.body.lastName,req.body.mobileNo,req.body.email,req.body.licenseNo,req.body.licenseUrl);
    console.log("****************result="+JSON.stringify(results));   
    res.send(results);
});

router.get('/get_drivers',async function(req,res,next){
    results =await getDrivers(req.query.userId,req.query.pageId);
    if(results.length<=0){
        responce=JSON.stringify({code:'500',msg:'No data found',data:''});
    }else{
        responce=JSON.stringify({code:'200',msg:'',data:results});
    }
    
    console.log("result="+JSON.stringify(responce))
   
    res.send(responce);
});
router.post('/payment',async function(req,res,next){
    
    //key_id: 'rzp_test_8KHr7ine3uj7uk',
    //key_secret: 'PLHjPWgp2HTRzkwvTPX9pp41',
    let amount=req.body.amount;
   let receiptId=req.body.bookingId;
   let agentId=req.body.agentId;
   let bookingAmount=req.body.bookingAmount;
   let pendingAmount=req.body.userAmount;
   let tripAmount=req.body.tripAmount;
   let userPaid=req.body.userPaid;
    const instance = new Razorpay({
        key_id: process.env.paymentId,
        key_secret: process.env.paymentSecreat,
    });
    console.log("*****************amount**********"+amount);
    
    const options = {
        amount: amount, // amount in smallest currency unit
        currency: "INR",
        receipt: receiptId,
    };

    const order = await instance.orders.create(options);
    console.log("order=====******"+order)
    console.log("order===="+JSON.stringify(order));
    let orgAmount=amount/100;
    addPaymentAgent(orgAmount,receiptId,agentId,order.id,bookingAmount,pendingAmount,tripAmount,userPaid);
    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
});

router.post('/success',async function(req,res,next){
    
    console.log("IN SUccess");
    let razorpayPaymentId=req.body.razorpayPaymentId;
   let razorpayOrderId=req.body.razorpayOrderId;
   let razorpaySignature=req.body.razorpaySignature;
   let rawResponce=req.body.rawResponce;
   let bookingAmount=0;//req.body.bookingAmount;
    console.log("Body=="+JSON.stringify(req.body))
    let resData=await updateBookingDetails(razorpayOrderId,rawResponce);
    res.json(resData);
});
router.get('/prepayment',async function(req,res,next){
    try {
        
        const instance = new Razorpay({
            key_id: 'rzp_live_lMUNjJZuvH00Im',
            key_secret: 'cvzKztFIkcdkU7dZbP9iQQSO',
        });
        
        let amount=req.body.amount;
        let receiptId=req.body.bookingId;

        const options = {
            amount: amount, // amount in smallest currency unit
            currency: "INR",
            receipt: receiptId,
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
 });
module.exports=router;