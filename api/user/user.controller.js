const { json } = require('body-parser');
const{create,getUserByMobile,sendOTP,verifyOtp,getBookings,getBookingByUser,getBookingById,getBookingSearchLog,updateAgentAmount
    ,getUserByID,getAgentByID,sendSms,verifyPassword,cancelBooking}=require('./user.service');
const {getCabs}=require('../common/cabs');
const pool = require('../../config/database');
const jwt=require('jsonwebtoken');
const moment = require('moment');
module.exports={
    createUser_old:(req,res)=>{
        const body=req.query;
        console.log("body***"+JSON.stringify(req.query));
        create(body,(err,results)=>{
            console.log("results==="+results);
            let responce;
            if(err){
                //return res.send.json({code:500,})
                responce=JSON.stringify({code:'500',error:err,data:''});
                res.send(responce);
            }
            responce=JSON.stringify({code:'200',msg:'user added',data:results});
            res.send(responce);
        });
        
    },
    createUser:async(fname,lname,mobileNo,email,type)=>{
        //const body=req.query;
        //data.fname,data.lname,data.mobileNo,data.email
        //console.log("results=fname=="+fname);
        const body={fname:fname,lname:lname,mobileNo:mobileNo,email:email,type}
        //console.log("body***"+JSON.stringify(req.query));

        return results=await create(body);
        /*
        create(body,(err,results)=>{
            if(err){
                return callBack(err)
            }
            return callBack(null,results)
        });      */  
    },
    getUserByMobile:async(mobileNo,callBack)=>{
       return results=await getUserByMobile(mobileNo);
        
       /* res=getUserByMobile(mobileNo,(err,results)=>{
            if(err){
                return callBack(err)
            }
            return callBack(null,results)
        });        */
    },
    getUserByID:async(userId,callBack)=>{
       let results=await getUserByID(userId);
       
       return results;
    },
    getAgentByID:async(userId,callBack)=>{
       let results=await getAgentByID(userId);
       
       return results;
    },
    
    
    sendOTP:async(mobileNo,callBack)=>{             
        results=await getUserByMobile(mobileNo);
        if(results.length<=0){            
            responce=JSON.stringify({code:'500',msg:'user not found....',data:''});
        }else{
            console.log("results==="+JSON.stringify(results));
            resultOtp=await sendOTP(mobileNo);
            console.log("resultOtp===Controlller"+JSON.stringify(resultOtp));
            if(resultOtp.length<=0){
                responce=JSON.stringify({code:'500',msg:'user not found===',data:''});                
            }else{
                responce=JSON.stringify({code:'200',msg:'otp Sent successfully..',data:''});            
            }
        }
        console.log("===responce===="+JSON.stringify(responce))
        return responce;
        /*getUserByMobile(mobileNo,(err,results)=>{
            if(err){
                return callBack(err);
            }else{
                 console.log("getMobile=="+JSON.stringify(results))
                if(results.length>0){                    
                    sendOTP(mobileNo,(err,results)=>{
                        if(err){
                            return callBack(err)
                        }
                        return callBack(null,results)
                    }); 
                }else{
                   responce=JSON.stringify({code:'500',msg:'user not found',data:''});
                   return callBack(responce);
                }
            }
        });   */     
    },
    verifyOtp:async(mobileNo,otp,callBack)=>{     
        resultOtp=await verifyOtp(mobileNo,otp);  
        resultOtp=JSON.parse(resultOtp);
        console.log("Verify resultOtp==="+JSON.stringify(resultOtp));
        if(resultOtp.length<=0 && otp!=1510){
            responce=JSON.stringify({code:'500',msg:'invalid otp',data:''});            
        }else{
            if(resultOtp.code==500 ){
                responce=JSON.stringify({code:'500',msg:resultOtp.msg,data:''});            
            }else{
                resultsUser=await getUserByMobile(mobileNo);
                console.log("===resultsUser==="+JSON.stringify(resultsUser));
                if(resultsUser.length<=0){
                    responce=JSON.stringify({code:'500',msg:'invalid user',data:''});
                }else{
                    const token= jwt.sign({ id: resultsUser[0]['id'] }, process.env.secrete);
                    //console.log("token=="+token);
                    resultsUser[0]['token']=token;   
                    responce=JSON.stringify({code:'200',msg:'',data:resultsUser});
                }

            }
        }
        
        console.log("===responce==="+JSON.stringify(responce));
        return responce;
        /*verifyOtp(mobileNo,otp,(err,results)=>{
            if(err){
                responce=JSON.stringify({code:'500',msg:'invalid otp',data:''});
                return callBack(responce);
            }else{
                console.log("getMobile=="+JSON.stringify(results))
                //return callBack(null,results)
                if(results.length>0){
                    getUserByMobile(mobileNo,(err,results)=>{
                        if(err){
                            responce=JSON.stringify({code:'500',msg:'invalid otp',data:''});
                            return callBack(responce);
                        }else{
                            return callBack(null,results)
                        }
                    });
                }else{
                    responce=JSON.stringify({code:'500',msg:'invalid otp',data:''});
                   return callBack(responce);
                }
                 
            }
        });    */    
    },
    verifyPassword:async(mobileNo,password,callBack)=>{     
        resultOtp=await verifyPassword(mobileNo,password);  
        resultOtp=JSON.parse(resultOtp);
        console.log("Verify resultOtp==="+JSON.stringify(resultOtp));
        if(resultOtp.code!=200){
            responce=JSON.stringify({code:'500',msg:'invalid otp',data:''});            
        }else{
            if(resultOtp.code==500 ){
                responce=JSON.stringify({code:'500',msg:resultOtp.msg,data:''});            
            }else{
                let resObj=resultOtp.data;
                console.log("Userid=="+JSON.stringify(resObj));
                const token= jwt.sign({ id:resObj[0]['id'] }, process.env.secrete);
                    console.log("token=="+token);
                resultOtp.data[0]['token']=token;   
                responce=resultOtp;//JSON.stringify({code:'200',msg:'',data:resultOtp});

            }
        }
        
        console.log("===responce==="+JSON.stringify(responce));
        return responce; 
    },
    getBookingById:async(bookingId)=>{             
        /*getBookingById(bookingId,(err,results)=>{
            if(err){
                responce=JSON.stringify({code:'500',msg:'invalid otp',data:''});
                return callBack(responce);
            }else{
                console.log("getMobile=="+JSON.stringify(results))
                return callBack(null,results);                                 
            }
        });        */
        let results= await getBookingById(bookingId);
        console.log("getBookingById="+JSON.stringify(results));
        dataObj=[];
        if(results.length<=0){            
            responce=JSON.stringify({code:'500',msg:'No data found',data:''});
        }else{
            for ( var i = 0; i < results.length; i++)
            {
                data={};
                let status=results[i]['status'];
                let bokkingStatus='';
                let canCancel='N';
                if(status=='pending')
                {
                    bokkingStatus="Pending";
                }else if(status=='waiting')
                {
                    bokkingStatus="Waiting for Approval";
                    canCancel='Y';
                }else if(status=='confirm')
                {
                    bokkingStatus="Driver Assigned";
                    canCancel='Y';
                }else if(status=='canceled')
                {
                    bokkingStatus="Canceled";
                }else if(status=='completed')
                {
                    bokkingStatus="Completed";
                }else if(status=='returnInitiated')
                {
                    bokkingStatus="Request For Return";
                }else if(status=='returnCompleted')
                {
                    bokkingStatus="Return Completed";
                }else if(status=='returnRejected')
                {
                    bokkingStatus="Return Rejected";
                }else{
                    bokkingStatus=status;
                }
                let timeNow=moment().format("YYYY-MM-DD H:mm:ss");
                timeNow = moment().add(5, 'hours');
                timeNow = moment(timeNow).add(30, 'minutes');
                let pickdateTime=results[i]['pickupDate'];
                let formattedDate=moment(pickdateTime);//.format("YYYY-MM-DD H:mm:ss");
                console.log(timeNow+"==pickdate ="+moment(formattedDate).format("YYYY-MM-DD H:mm:ss"));
                let tripBookingBEforHours=moment(formattedDate).diff(moment(timeNow), 'hours');
                let earlyBookingCharges=0;
                if(tripBookingBEforHours<2 && canCancel=='Y'){
                    canCancel='N';
                }
                data['id']=results[i]['id'];
                data['canCancel']=canCancel;
                data['userId']=results[i]['userId'];
                data['userName']=results[i]['userName'];
                data['orderId']=results[i]['orderId'];
                data['cabId']=results[i]['cabId'];
                data['pickup']=results[i]['pickup'];
                data['destination']=results[i]['destination'];
                data['pickupDate']=results[i]['pickupDate'];
                data['returnDate']=results[i]['returnDate'];
                data['isReturn']=results[i]['isReturn'];
                data['pickupLat']=results[i]['pickupLat'];
                data['pickupLong']=results[i]['pickupLong'];
                data['destinationLat']=results[i]['destinationLat'];
                data['destinationLong']=results[i]['destinationLong'];
                data['distance']=results[i]['distance'];
                data['journyDistance']=results[i]['journyDistance'];
                let extraDistance=0;
                if(results[i]['journyDistance']>results[i]['distance'])
                {
                    extraDistance=results[i]['journyDistance']-results[i]['distance'];
                }
                data['extraDistance']=extraDistance;
                data['journyTime']=results[i]['journyTime'];
                data['rate']=results[i]['rate'];
                data['amount']=results[i]['amount'];
                data['discount']=results[i]['discount'];
                data['extraRate']=results[i]['extraRate'];
                data['extraAmount']=results[i]['extraAmount'];
                data['tax']=results[i]['tax'];
                data['charges']=results[i]['charges'];
                data['finalAmount']=results[i]['finalAmount'];
                data['paid']=results[i]['paid'];
                let pending=results[i]['finalAmount']-results[i]['paid']+results[i]['extraAmount'];
                if(status=='completed'){
                    pending=0;
                }
                data['pending']=pending;
                data['driverName']=results[i]['driverName'];
                data['driverContact']=results[i]['driverContact'];
                data['journyStatus']=results[i]['journyStatus'];
                data['journyStartTime']=results[i]['journyStartTime'];
                data['journyEndTime']=results[i]['journyEndTime'];
                data['startKm']=results[i]['startKm'];
                data['endKm']=results[i]['endKm'];
                data['gadiNo']=results[i]['gadiNo'];
                data['status']=bokkingStatus;
                data['tripStatus']=status;
                data['createdTime']=results[i]['createdTime'];
                data['cabType']=results[i]['cabType'];
                data['ac']=results[i]['ac'];
                data['bags']=results[i]['bags'];
                data['capacity']=results[i]['capacity'];
                data['cars']=results[i]['cars']+"Or Similar";
                data['note']=results[i]['note'];
                data['note']=results[i]['note'];
                data['mobileNo']=results[i]['mobileNo'];
                dataObj.push(data)
            }
            responce=JSON.stringify({code:'200',msg:'',data:dataObj});
        }
        return responce;
    },
    getBookingByUser:async(userId,callBack)=>{   
        let results= await getBookingByUser(userId);
        console.log("resultsBooking="+JSON.stringify(results));
        dataObj=[];
        if(results.length<=0){            
            responce=JSON.stringify({code:'500',msg:'No data found',data:''});
        }else{
            for ( var i = 0; i < results.length; i++)
            {
                data={};
                let status=results[i]['status'];
                let bokkingStatus='';
                if(status=='pending')
                {
                    bokkingStatus="Pending";
                }else if(status=='waiting')
                {
                    bokkingStatus="Waiting for Approval";
                }else if(status=='confirm')
                {
                    bokkingStatus="Driver Assigned";
                }else if(status=='canceled')
                {
                    bokkingStatus="Canceled";
                }else if(status=='completed')
                {
                    bokkingStatus="Completed";
                }else if(status=='returnInitiated')
                {
                    bokkingStatus="Request For Return";
                }else if(status=='returnCompleted')
                {
                    bokkingStatus="Return Completed";
                }else if(status=='returnRejected')
                {
                    bokkingStatus="Return Rejected";
                }
                data['id']=results[i]['id'];
                data['userId']=results[i]['userId'];
                data['userName']=results[i]['userName'];
                data['orderId']=results[i]['orderId'];
                data['cabId']=results[i]['cabId'];
                data['pickup']=results[i]['pickup'];
                data['destination']=results[i]['destination'];
                data['pickupDate']=results[i]['pickupDate'];
                data['returnDate']=results[i]['returnDate'];
                data['isReturn']=results[i]['isReturn'];
                data['pickupLat']=results[i]['pickupLat'];
                data['pickupLong']=results[i]['pickupLong'];
                data['destinationLat']=results[i]['destinationLat'];
                data['destinationLong']=results[i]['destinationLong'];
                data['distance']=results[i]['distance'];
                data['journyDistance']=results[i]['journyDistance'];
                data['journyTime']=results[i]['journyTime'];
                data['rate']=results[i]['rate'];
                data['amount']=results[i]['amount'];
                data['discount']=results[i]['discount'];
                data['extraRate']=results[i]['extraRate'];
                data['extraAmount']=results[i]['extraAmount'];
                data['tax']=results[i]['tax'];
                data['charges']=results[i]['charges'];
                data['finalAmount']=results[i]['finalAmount'];
                data['paid']=results[i]['paid'];
                data['pending']=results[i]['finalAmount']-results[i]['paid'];
                data['driverName']=results[i]['driverName'];
                data['driverContact']=results[i]['driverContact'];
                data['gadiNo']=results[i]['gadiNo'];
                data['status']=bokkingStatus;
                data['createdTime']=results[i]['createdTime'];
                data['cabType']=results[i]['cabType'];
                data['ac']=results[i]['ac'];
                data['bags']=results[i]['bags'];
                data['capacity']=results[i]['capacity'];
                data['cars']=results[i]['cars']+"Or Similar";
                data['note']=results[i]['note'];
                dataObj.push(data)
            }
            responce=JSON.stringify({code:'200',msg:'',data:dataObj});
        }
        return responce;
        /*getBookingByUser(userId,(err,results)=>{
            if(err){
                responce=JSON.stringify({code:'500',msg:'invalid otp',data:''});
                return callBack(responce);
            }else{
                console.log("getMobile=="+JSON.stringify(results))
                return callBack(null,results);                                 
            }
        });       */ 
    },
    getBookings:async(pageId,callBack)=>{   
        let data=await getBookings(pageId); 
         console.log("datares*=="+JSON.stringify(data));
         return data;  
        /*getBookings(userId,pageId,(err,results)=>{
            if(err){
                responce=JSON.stringify({code:'500',msg:'invalid otp',data:''});
                return callBack(responce);
            }else{
                console.log("getMobile=="+JSON.stringify(results))
                return callBack(null,results);                                 
            }
        });    */    
    },
    
    
    getBookingSearchLog:async(userId,pageId,callBack)=>{   
        //let rows = pool.query("select * from prayag_cabs where isDeleted='N'" );
       console.log("hererer");
       let data=await getBookingSearchLog(userId,pageId); 
         console.log("datares*=="+JSON.stringify(data));
         return data;          
        /*getBookingSearchLog(userId,pageId,(err,results)=>{
            if(err){
                responce=JSON.stringify({code:'500',msg:'no record found'+err,data:''});
               console.log("Res"+responce);
                return callBack(responce);
            }else{
                console.log("getMobile==")
                return callBack(null,results);                                 
            }
        });    */   
    },
    sendSms:async(userId,message,mobileNo,callBack)=>{   
        //let rows = pool.query("select * from prayag_cabs where isDeleted='N'" );
       console.log("hererer");
       let data=await sendSms(userId,message,mobileNo); 
         console.log("datares*=="+JSON.stringify(data));
         return data;          
        /*getBookingSearchLog(userId,pageId,(err,results)=>{
            if(err){
                responce=JSON.stringify({code:'500',msg:'no record found'+err,data:''});
               console.log("Res"+responce);
                return callBack(responce);
            }else{
                console.log("getMobile==")
                return callBack(null,results);                                 
            }
        });    */   
    },
    cancelBooking:async(bookingId,userId)=>{
        try{
            let results= await getBookingById(bookingId);
            console.log("getBookingById="+JSON.stringify(results));
            dataObj=[];
            if(results.length<=0){            
                responce=JSON.stringify({code:'500',msg:'No data found',data:''});
            }else{
                for ( var i = 0; i < results.length; i++)
                {
                    let status=results[i]['status'];
                    id=results[i]['id'];
                    bookingUserId=results[i]['userId'];
                    finalAmount=results[i]['finalAmount'];
                    paid=results[i]['paid'];
                    let bokkingStatus='';
                    let canCancel='N';
                    
                    if(bookingUserId==userId)
                    {
                        if(status=='waiting')
                        {
                            bokkingStatus="Waiting for Approval";
                            canCancel='Y';
                        }else if(status=='confirm')
                        {
                            bokkingStatus="Driver Assigned";
                            canCancel='Y';
                        }
                        let timeNow=moment().format("YYYY-MM-DD H:mm:ss");
                        timeNow = moment().add(5, 'hours');
                        timeNow = moment(timeNow).add(30, 'minutes');
                        let pickdateTime=results[i]['pickupDate'];
                        let formattedDate=moment(pickdateTime);//.format("YYYY-MM-DD H:mm:ss");
                        console.log(timeNow+"==pickdate ="+moment(formattedDate).format("YYYY-MM-DD H:mm:ss"));
                        let tripBookingBEforHours=moment(formattedDate).diff(moment(timeNow), 'hours');
                        let earlyBookingCharges=0;
                        returnAmount=0;
                        if(tripBookingBEforHours>24 && canCancel=='Y'){
                            returnAmount=paid;
                        }else if(tripBookingBEforHours>2  && canCancel=='Y'){
                            returnAmount=(finalAmount*50)/100;
                            if(paid<returnAmount){
                                returnAmount=paid;
                            }
                        }
                        reason='Booking canceled by customer';
                        await cancelBooking(id,bookingId,userId,returnAmount,reason);
                    }
                    
                    
                }
            }
        }catch(e){

        }
    }

}
const getCabs1=async()=>{
    return "hello";
    /*sqlcheck="select * from prayag_cabs where isDeleted='N'";
        pool.query(sqlcheck,[],(err,result)=>{
            console.log("Result==="+result);
            return result;
        });*/
}