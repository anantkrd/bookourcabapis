const { json } = require('body-parser');
const{getBookingsAdminHome,updateAgentAmount,getBookingsForAgent,getCompletedBookings,getReadyBooking,getConfirmBooking}=require('./admin.service');
module.exports={
    getBookingsAdminHome:async(pageId=1)=>{   
        let data=await getBookingsAdminHome(pageId); 
         console.log("datares*=="+JSON.stringify(data));
         return data;    
    },
    updateAgentAmount:async(amount,bookingId)=>{
        let data=await updateAgentAmount(amount,bookingId); 
         console.log("datares*=="+JSON.stringify(data));
         return data;          
    }
    ,
    getWaitingForAgentBooking:async(userId,pageId=1)=>{
        let results=await getBookingsForAgent(pageId); 
         //console.log("datares*=="+JSON.stringify(datares));
         if(results.length<=0){
            responce=JSON.stringify({code:'500',msg:'No Data found',data:''});
        }else{            
            responce=JSON.stringify({code:'200',msg:'',data:results,pageId:pageId});
        }
         return responce;         
    },
    getCompletedBookings:async(userId,pageId=1)=>{
        //console.log("Here in controleler");
        let results=await getCompletedBookings(pageId); 
         //console.log("datares*=="+JSON.stringify(datares));
         if(results.length<=0){
            responce=JSON.stringify({code:'500',msg:'No Data found',data:''});
        }else{
            
            responce=JSON.stringify({code:'200',msg:'',data:results,pageId:pageId});
        }
         return responce;        
    },
    getReadyBooking:async(userId,pageId=1)=>{
        //console.log("Here in controleler");
        let results=await getReadyBooking(pageId); 
         //console.log("datares*=="+JSON.stringify(datares));
         if(results.length<=0){
            responce=JSON.stringify({code:'500',msg:'No Data found',data:''});
        }else{
            
            responce=JSON.stringify({code:'200',msg:'',data:results,pageId:pageId});
        }
         return responce;        
    },
    getConfirmBooking:async(userId,pageId=1)=>{
        //console.log("Here in controleler");
        let results=await getConfirmBooking(pageId); 
         //console.log("datares*=="+JSON.stringify(datares));
         if(results.length<=0){
            responce=JSON.stringify({code:'500',msg:'No Data found',data:''});
        }else{
            
            responce=JSON.stringify({code:'200',msg:'',data:results,pageId:pageId});
        }
         return responce;        
    },
    

    /*getMyCompletedBookings:async(agentId,pageId=1)=>{
        //console.log("Here in controleler");
        let results=await getMyCompletedBookings(agentId,pageId); 
         //console.log("datares*=="+JSON.stringify(datares));
         if(results.length<=0){
            responce=JSON.stringify({code:'500',msg:'No Data found',data:''});
        }else{
            
            responce=JSON.stringify({code:'200',msg:'',data:results});
        }
         return responce;        
    },*/
    
}