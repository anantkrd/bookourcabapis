const express=require('express');

const jwt=require('jsonwebtoken');
const{createUser,getUserByMobile}=require('../user/user.controller');
const {create_booking,getCabs,create_booking_log}=require('../booking/booking.controller');
const{getSurge,addPayment,updateBookingDetails}=require('../booking/booking.service');
const {authenticate}=require('../auth/index');
const router=express.Router();
var distance = require('google-distance-matrix');
const Razorpay = require("razorpay");
/*const authenticate=function(req,res,next){
    console.log("Here is in auth");
    jwt.verify();
    next();
}*/
router.get('/book_cab', async function(req,res,next){
    //console.log("mobileNo=="+req.query.mobileNo);
    let userId=0;
    let error='';
    
    let fname=req.query.fname;
    let lname=req.query.lname;
    let orderId=req.query.bookingId;
    let cabId=req.query.cabId;
    let pickup=req.query.pickup;
    let destination=req.query.destination;
    let pickupDate=req.query.pickupDate;
    let returnDate=req.query.returnDate;
    let isReturn=req.query.isReturn;
    let pickupLat=req.query.pickupLat;
    let pickupLong=req.query.pickupLong;
    let destinationLat=req.query.destinationLat;
    let destinationLong=req.query.destinationLong;
    let distance=req.query.distance;
    let rate=req.query.rate;
    let amount=req.query.amount;
    let discount=req.query.discountAmount;
    let finalAmount=req.query.finalAmount;
    let status=req.query.status;    
    let pickupCityName=req.query.pickupCityName;
    let pickupDistrict=req.query.pickupDistrict;
    let pickupState=req.query.pickupState;
    let dropCityName=req.query.dropCityName;
    let dropDistrict=req.query.dropDistrict;
    let dropState=req.query.dropState;
    let journyTime=req.query.journyTime;
    let responce;
    resultUser=await getUserByMobile(req.query.mobileNo);
    if(resultUser.length<=0){
        
        results=await createUser(req.query.fname,req.query.lname,req.query.mobileNo,req.query.email,'user');
        if(results.length<=0){
            responce=JSON.stringify({code:'500',msg:'some internal error',data:''});
        }else{
            userId=results.insertId;
                        //userId=results[0]['id'];
                        userName=fname+" "+lname;
                        const body={userId:userId,userName:userName,email:req.query.email,orderId:orderId,cabId:req.query.cabId,pickup:req.query.pickup,destination:req.query.destination,pickupDate:req.query.pickupDate,returnDate:req.query.returnDate,isReturn:req.query.isReturn,pickupLat:req.query.pickupLat,pickupLong:req.query.pickupLong,
                            destinationLat:req.query.destinationLat,destinationLong:req.query.destinationLong,distance:req.query.distance,rate:rate,amount:req.query.amount,discount:discount,finalAmount:req.query.finalAmount,status:'pending',journyTime:journyTime,
                            payment_orderId:req.query.payment_orderId,pickupCityName:pickupCityName,pickupDistrict:pickupDistrict,pickupState:pickupState,
                            dropCityName:dropCityName,dropDistrict:dropDistrict,dropState:dropState}
                        console.log("logData***2*==="+JSON.stringify(body));
                        create_booking(body,(err,results)=>{
                            if(err){
                                error=err;
                                responce=JSON.stringify({code:'500',msg:'some internal error'+err,data:''});
                                
                            }else{
                                responce=JSON.stringify({code:'200',msg:'success',data:results.insertId});
                                                                //responce=JSON.stringify({code:'200',msg:'user added',data:results.insertId});
                            }
                            //res.send(responce);

                        });
        }
        res.send(responce);
    }else{
        userId=results[0]['id'];
        userName=fname+" "+lname;
        const body={userId:userId,userName:userName,email:req.query.email,orderId:orderId,cabId:req.query.cabId,pickup:req.query.pickup,destination:req.query.destination,pickupDate:req.query.pickupDate,returnDate:req.query.returnDate,isReturn:req.query.isReturn,pickupLat:req.query.pickupLat,pickupLong:req.query.pickupLong,
            destinationLat:req.query.destinationLat,destinationLong:req.query.destinationLong,distance:req.query.distance,rate:rate,amount:req.query.amount,discount:discount,finalAmount:req.query.finalAmount,status:'pending',journyTime:journyTime,payment_orderId:req.query.payment_orderId,
            pickupCityName:pickupCityName,pickupDistrict:pickupDistrict,pickupState:pickupState,
            dropCityName:dropCityName,dropDistrict:dropDistrict,dropState:dropState}
            
            create_booking(body,(err,results)=>{
                if(err){
                    responce=JSON.stringify({code:'500',msg:'some internal error 2'+err,data:''});
                    
                }else{
                    userId=results.insertId;
                    //responce=JSON.stringify({code:'200',msg:'user added',data:results.insertId});
                    responce=JSON.stringify({code:'200',msg:'success',data:userId});  
                    //res.send(responce);                      
                }
                res.send(responce);
            });
    }
    /*res1=await getUserByMobile(req.query.mobileNo,(err,results)=>{
        if(err){
            error=err;
            responce=JSON.stringify({code:'500',msg:'some internal error',data:err});
           // console.log("Here2");
            res.send(responce);
        }else{
            if(results.length>0){                
                userId=results[0]['id'];
                userName=fname+" "+lname;
                console.log("=== userId id="+userId);
                // booking=[data.userId,data.userName,data.cabId,data.pickup,data.destination,data.pickupDate,data.returnDate,data.isReturn,data.pickupLat,data.pickupLong,data.destinationLat,data.destinationLong,data.distance,data.rate,data.amount,data.discount,data.finalAmount,data.status];
                const body={userId:userId,userName:userName,email:req.query.email,orderId:orderId,cabId:req.query.cabId,pickup:req.query.pickup,destination:req.query.destination,pickupDate:req.query.pickupDate,returnDate:req.query.returnDate,isReturn:req.query.isReturn,pickupLat:req.query.pickupLat,pickupLong:req.query.pickupLong,
                destinationLat:req.query.destinationLat,destinationLong:req.query.destinationLong,distance:req.query.distance,rate:rate,amount:req.query.amount,discount:discount,finalAmount:req.query.finalAmount,status:'pending',journyTime:journyTime,payment_orderId:req.query.payment_orderId}
                console.log("logData**1**==="+JSON.stringify(body));
                create_booking(body,(err,results)=>{
                    if(err){
                       // console.log("=== err id="+err);
                        responce=JSON.stringify({code:'500',msg:'some internal error 2'+err,data:''});
                        
                    }else{
                        userId=results.insertId;
                        //console.log("last ** booking inserted id...="+userId);
                        //responce=JSON.stringify({code:'200',msg:'user added',data:results.insertId});
                        responce=JSON.stringify({code:'200',msg:'success',data:userId});  
                        //res.send(responce);                      
                    }
                    //console.log("Here4");
                    res.send(responce);
                    //console.log("here1");
                });
            }else{
                results=await createUser(req.query.fname,req.query.lname,req.query.mobileNo,req.query.email,'user');
                if(results.length<=0){

                }
                res1=await createUser(req.query.fname,req.query.lname,req.query.mobileNo,req.query.email,(err,results)=>{
                    if(err){
                        responce=JSON.stringify({code:'500',msg:'some internal error 22'+err,data:''});
                        res.send(responce);
                    }else{
                        userId=results.insertId;
                        //userId=results[0]['id'];
                        userName=fname+" "+lname;
                        //console.log("last *** inserted id...="+results.insertId);
                        const body={userId:userId,userName:userName,email:req.query.email,orderId:orderId,cabId:req.query.cabId,pickup:req.query.pickup,destination:req.query.destination,pickupDate:req.query.pickupDate,returnDate:req.query.returnDate,isReturn:req.query.isReturn,pickupLat:req.query.pickupLat,pickupLong:req.query.pickupLong,
                            destinationLat:req.query.destinationLat,destinationLong:req.query.destinationLong,distance:req.query.distance,rate:rate,amount:req.query.amount,discount:discount,finalAmount:req.query.finalAmount,status:'pending',journyTime:journyTime,payment_orderId:req.query.payment_orderId}
                        console.log("logData***2*==="+JSON.stringify(body));
                        create_booking(body,(err,results)=>{
                            if(err){
                                error=err;
                                responce=JSON.stringify({code:'500',msg:'some internal error'+err,data:''});
                                
                            }else{
                                //console.log("last **** booking inserted id...="+results.insertId);
                                responce=JSON.stringify({code:'200',msg:'success',data:results.insertId});
                                                                //responce=JSON.stringify({code:'200',msg:'user added',data:results.insertId});
                            }
                            res.send(responce);

                        });
                        //responce=JSON.stringify({code:'200',msg:'user added',data:results.insertId});
                    }
                    //res.send(responce);
                }); 
            }            
        }
    });  */   
});
router.get('/getCabs',async function(req,res,next){

    console.log("herere");
    distance.key('AIzaSyDzlGIoqMbQKaNwu1tCMXCtW3UEjzCfUvs');
    distance.mode('driving');
    console.log(req);
    originObj=JSON.parse(req.query.originObj);
    destinationObj=JSON.parse(req.query.destinationObj);
    console.log("=**=="+originObj.lat);
   
   let originlat=originObj.lat;
   let originlng=originObj.lng;
   let destinationlat=destinationObj.lat;
   let destinationlng=destinationObj.lng;
   let pickupCity=req.query.pickupCity;
   let destinationCity=req.query.destinationCity;
   let pickdateTime=req.query.pickdateTime;
   let returnDateTime=req.query.returnDateTime;
   let mobileNo=req.query.mobileNo;
   let bookingId=req.query.bookingId;
   var origins = [originObj.lat+','+originObj.lng];
    var destinations = [destinationObj.lat+','+destinationObj.lng];
    
   let pickupCityName=req.query.pickupCityName;
   let pickupDistrict=req.query.pickupDistrict;
   let pickupState=req.query.pickupState;
   let dropCityName=req.query.dropCityName;
   let dropDistrict=req.query.dropDistrict;
   let dropState=req.query.dropState;
   
    let distancekm=0;
    
    distance.matrix(origins, destinations, async function (err, distances) {
        if (!err)
            //console.log("distances****"+JSON.stringify(distances.rows[0].elements[0]));
            //console.log("distances****"+JSON.stringify(distances.rows[0].elements[0].duration.text));
            distanceObj=JSON.parse(distances.rows[0].elements[0].distance.value);
            journyTime=JSON.parse(distances.rows[0].elements[0].duration.value);
            journyTime1=distances.rows[0].elements[0].duration.text.toString();
           // timeObj=JSON.parse(distances);
            //journyTime1=JSON.parse(distances.rows[0].elements[0].duration);
            //console.log(distances.rows[0].elements[0].duration.text+"***journyTime=="+journyTime);
            distancekm=Math.round(distanceObj/1000);
            surgekm=Math.round(distancekm/100);
            let searchLog=[];
            //booking=[data.mobileNo,data.pickup,data.destination,data.pickupDate,data.returnDate,data.pickupLat,data.pickupLong,data.destinationLat,data.destinationLong,data.distance,data.journyTime,'N'];
            
            
            let sedanPrice=0;
            let luxuryPrice=0;
            let compactPrice=0;
            let pickupcityName=pickupCity.split(",")[0]
            let surgePickpuResult=await getSurge(pickupDistrict);
            let destinationcityName=destinationCity.split(",")[0]
            let surgedestinationResult=await getSurge(dropDistrict);
            //console.log("surgeResult==="+surgePickpuResult[0]['sedan']);
            
            let results=await getCabs(req);
            distanceValue=distancekm;
            dataObj=[];
            if(results.length<=0){
                error=err;
                responce=JSON.stringify({code:'500',msg:'some internal error',data:''});
            }else{
                for ( var i = 0; i < results.length; i++)
                {
                    rate=results[i]['rate'];
                    let originalRate=rate;
                    returnTripRate=results[i]['returnTripRate'];
                    id=results[i]['id'];                
                    //console.log("ID: " + id);
                    cabType=results[i]['cabType'];
                            
                    discount=results[i]['discount'];
                    
                    finalRate=rate;
                    image=results[i]['image'];
                    ac=results[i]['ac'];
                    bags=results[i]['bags'];
                    cars=results[i]['cars'];
                    capacity=results[i]['capacity'];
                    note=results[i]['note'];
                    multiply=2;
                    if(returnDateTime=="" || returnDateTime==undefined || returnDateTime=='undefined'|| returnDateTime=="0000-00-00 00:00:00"){
                        multiply=1;
                        finalRate=rate;
                    }else{
                        distanceValue=distanceValue*2;
                        distancekm=distanceValue;                        
                        finalRate=returnTripRate;
                        originalRate=returnTripRate;
                    }
                    
                    let cabTypecheck=cabType.toLowerCase();
                    
                    if(cabTypecheck!=""){
                        let surgeDataPickup=surgePickpuResult[0]['surge'];
                        let surgeDataPickupObj=JSON.parse(surgeDataPickup);
                        
                        surgePrice=surgekm*surgeDataPickupObj[cabType];
                        let surgeDataDrop=surgedestinationResult[0]['surge'];
                        let surgeDataDropObj=JSON.parse(surgeDataDrop);
                        
                        surgePrice=surgePrice+(surgekm*surgeDataDropObj[cabType]);
                        
                        finalRate=finalRate+surgePrice;
                        sedanPrice=finalRate;
                    }else{
                        surgePrice=surgekm*1;
                        surgePrice=surgePrice+(surgekm*1);
                        
                        finalRate=finalRate+surgePrice;
                        sedanPrice=finalRate;
                    }
                    amount=(distanceValue*finalRate);
                    discountAmount=(distanceValue*discount);
                    discountedRate=finalRate-discount;
                    finalAmount=(distanceValue*discountedRate);
                    
                    console.log("surgekm"+surgekm);
                    console.log("surgePrice"+surgePrice);
                    console.log("finalRate"+finalRate);
                    idKey='id';
                    console.log("returnDateTime*****************: " + returnDateTime);
                    if(returnDateTime=="" || returnDateTime==undefined || returnDateTime=="undefined" || returnDateTime==null){
                        returnDateTime="0000-00-00 00:00:00";
                    }
                    dataObj1={};
                    bookingId=id+""+Date.now();
                    dataObj1['id']=id;
                    dataObj1['bookingId']=bookingId;
                    
                    dataObj1['pickupCityName']=pickupCityName;
                    dataObj1['pickupDistrict']=pickupDistrict;
                    dataObj1['pickupState']=pickupState;
                    dataObj1['dropCityName']=dropCityName;
                    dataObj1['dropDistrict']=dropDistrict;
                    dataObj1['dropState']=dropState;
                    dataObj1['cabType']=cabType;
                    dataObj1['image']=image;
                    dataObj1['ac']=ac;
                    dataObj1['bags']=bags;
                    dataObj1['cars']=cars;
                    dataObj1['capacity']=capacity;
                    dataObj1['note']=note;
                    dataObj1['amount']=amount;
                    dataObj1['journyTime']=journyTime1;
                    dataObj1['discountAmount']=discountAmount;
                    dataObj1['rate']=discountedRate;
                    dataObj1['finalAmount']=finalAmount;
                    dataObj1['mobileNo']=mobileNo;
                    dataObj1['pickupCity']=pickupCity;
                    dataObj1['destinationCity']=destinationCity;
                    dataObj1['pickupDate']=pickdateTime;
                    dataObj1['returnDateTime']=returnDateTime;
                    dataObj1['originlat']=originlat;
                    dataObj1['originlng']=originlng;
                    dataObj1['destinationlat']=destinationlat;
                    dataObj1['destinationlng']=destinationlng;
                    dataObj1['distance']=distancekm;
                    //dataObj1['originlng']=originlng;
                    dataObj.push(dataObj1);
                }
                responce=JSON.stringify({code:'200',msg:'',data:dataObj});
            }
            const logData={mobileNo:mobileNo,pickup:pickupCity,destination:destinationCity,pickupDate:pickdateTime,returnDate:returnDateTime,pickupLat:originlat,pickupLong:originlng,destinationLat:destinationlat,destinationLong:destinationlng,distance:distancekm,
                journyTime:journyTime1,sedanRate:sedanPrice,luxuryRate:luxuryPrice,compactRate:compactPrice}
            //console.log("logData==="+JSON.stringify(logData));
            create_booking_log(logData,(err,results)=>{
                console.log("create_booking_log Error====="+err);
                console.log("create_booking_log results====="+results);
            });
            res.send(responce);
            
            /*console.log("responce****"+responce);
            console.log("Cab data async======"+cabsData);
            let res1=getCabs(req,(err,results)=>{
                if(err){
                    error=err;
                    responce=JSON.stringify({code:'500',msg:'some internal error',data:''});
                // console.log("Here2");            
                }else{
                    console.log("****"+results.length);
                    dataObj=[];
                    distanceValue=distancekm;
                    for ( var i = 0; i < results.length; i++)
                    {
                        rate=results[i]['rate'];
                        returnTripRate=results[i]['returnTripRate'];
                        id=results[i]['id'];                
                        //console.log("ID: " + id);
                        cabType=results[i]['cabType'];
                                
                        discount=results[i]['discount'];
                        
                        finalRate=rate-discount;
                        image=results[i]['image'];
                        ac=results[i]['ac'];
                        bags=results[i]['bags'];
                        cars=results[i]['cars'];
                        capacity=results[i]['capacity'];
                        note=results[i]['note'];
                        multiply=2;
                        if(returnDateTime=="" || returnDateTime==undefined || returnDateTime=='undefined'){
                            multiply=1;
                            finalRate=returnTripRate-discount;
                        }
                        console.log("=returnDateTime="+returnDateTime+"+==multiply="+multiply);
                        amount=(distanceValue*rate);
                        discountAmount=(distanceValue*discount);
                        finalAmount=(distanceValue*finalRate);
                        if(cabType=='Sedan'){
                            sedanPrice=finalRate;
                        }
                        if(cabType=='Luxury'){
                            luxuryPrice=finalRate;
                        }
                        if(cabType=='Compact'){
                            compactPrice=finalRate;
                        }
                        idKey='id';
                        //console.log("ID: " + id);
                        dataObj1={};
                        bookingId=id+""+Date.now();
                        dataObj1['id']=id;
                        dataObj1['bookingId']=bookingId;
                        dataObj1['cabType']=cabType;
                        dataObj1['image']=image;
                        dataObj1['ac']=ac;
                        dataObj1['bags']=bags;
                        dataObj1['cars']=cars;
                        dataObj1['capacity']=capacity;
                        dataObj1['note']=note;
                        dataObj1['amount']=amount;
                        dataObj1['journyTime']=journyTime1;
                        dataObj1['discountAmount']=discountAmount;
                        dataObj1['rate']=rate;
                        dataObj1['finalAmount']=finalAmount;
                        dataObj1['mobileNo']=mobileNo;
                        dataObj1['pickupCity']=pickupCity;
                        dataObj1['destinationCity']=destinationCity;
                        dataObj1['pickupDate']=pickdateTime;
                        dataObj1['returnDateTime']=returnDateTime;
                        dataObj1['originlat']=originlat;
                        dataObj1['originlng']=originlng;
                        dataObj1['destinationlat']=destinationlat;
                        dataObj1['destinationlng']=destinationlng;
                        dataObj1['distance']=distancekm;
                        //dataObj1['originlng']=originlng;
                        dataObj.push(dataObj1)
                    }
                    responce=JSON.stringify({code:'200',msg:'',data:dataObj});
                    //console.log(dataObj)
                    const logData={mobileNo:mobileNo,pickup:pickupCity,destination:destinationCity,pickupDate:pickdateTime,returnDate:returnDateTime,pickupLat:originlat,pickupLong:originlng,destinationLat:destinationlat,destinationLong:destinationlng,distance:distancekm,
                        journyTime:journyTime1,sedanRate:sedanPrice,luxuryRate:luxuryPrice,compactRate:compactPrice}
                    console.log("logData==="+JSON.stringify(logData));
                    create_booking_log(logData,(err,results)=>{
                        console.log("create_booking_log Error====="+err);
                        console.log("create_booking_log results====="+results);
                    });
                }
                res.send(responce);
            });*/
    });
});
router.get('/getBookingById',function(req,res,next){

    let bookingId=req.query.bookingId;
    res1=getBookingById(req,(err,results)=>{
        if(err){
            error=err;
            responce=JSON.stringify({code:'500',msg:'some internal error',data:''});
                // console.log("Here2");            
        }else{
            console.log("****"+results.length);
            dataObj=[];
            responce=JSON.stringify({code:'200',msg:'',data:results});
                    //console.log(dataObj)
        }
        res.send(responce);
        
    });
});
router.get('/getBooking_by_order',function(req,res,next){

   let mobileNo=req.query.mobileNo;
   let bookingId=req.query.bookingId;
   let token=req.query.token;
   var origins = [originObj.lat+','+originObj.lng];
    var destinations = [destinationObj.lat+','+destinationObj.lng];
    let distancekm=0;
    
    res1=getCabs(req,(err,results)=>{
        if(err){
            error=err;
            responce=JSON.stringify({code:'500',msg:'some internal error',data:''});
        // console.log("Here2");            
        }else{
            console.log("****"+results.length);
            dataObj=[];
            distanceValue=distancekm;
            for ( var i = 0; i < results.length; i++)
            {
                rate=results[i]['rate'];
                finalRate=results[i]['finalRate'];
                id=results[i]['id'];                
                //console.log("ID: " + id);
                cabType=results[i]['cabType'];
                        
                discount=results[i]['discount'];
                image=results[i]['image'];
                ac=results[i]['ac'];
                bags=results[i]['bags'];
                cars=results[i]['cars'];
                capacity=results[i]['capacity'];
                note=results[i]['note'];
                let multiply=2;
                if(returnDateTime=="" || returnDateTime==undefined || returnDateTime=='undefined'){
                    multiply=1;
                }
                console.log("=returnDateTime="+returnDateTime+"+==multiply="+multiply);
                let amount=(distanceValue*rate)*multiply;
                let discountAmount=(distanceValue*discount)*multiply;
                let finalAmount=(distanceValue*finalRate)*multiply;
                        
                //amount=distanceValue*rate;
                //discountAmount=distanceValue*discount;
                //finalAmount=distanceValue*finalRate;
                idKey='id';
                
                //console.log("ID: " + id);
                dataObj1={};
                bookingId=id+""+Date.now();
                dataObj1['id']=id;
                dataObj1['bookingId']=bookingId;
                dataObj1['cabType']=cabType;
                dataObj1['image']=image;
                dataObj1['ac']=ac;
                dataObj1['bags']=bags;
                dataObj1['cars']=cars;
                dataObj1['capacity']=capacity;
                dataObj1['note']=note;
                dataObj1['amount']=amount;
                dataObj1['journyTime']=journyTime1;
                dataObj1['discountAmount']=discountAmount;
                dataObj1['rate']=rate;
                dataObj1['finalAmount']=finalAmount;
                dataObj1['mobileNo']=mobileNo;
                dataObj1['pickupCity']=pickupCity;
                dataObj1['destinationCity']=destinationCity;
                dataObj1['pickupDate']=pickdateTime;
                dataObj1['returnDateTime']=returnDateTime;
                dataObj1['originlat']=originlat;
                dataObj1['originlng']=originlng;
                dataObj1['destinationlat']=destinationlat;
                dataObj1['destinationlng']=destinationlng;
                dataObj1['distance']=distancekm;
                //dataObj1['originlng']=originlng;
                dataObj.push(dataObj1)
            }
            responce=JSON.stringify({code:'200',msg:'',data:dataObj});
            //console.log(dataObj)
        }
        res.send(responce);
    });
});

router.post('/payment',async function(req,res,next){
    
    let amount=req.body.amount;
   let receiptId=req.body.bookingId;
   let mobileNo=req.body.mobileNo;
    const instance = new Razorpay({
        key_id: 'rzp_test_8KHr7ine3uj7uk',
        key_secret: 'PLHjPWgp2HTRzkwvTPX9pp41',
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
    addPayment(orgAmount,receiptId,mobileNo,order.id);
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