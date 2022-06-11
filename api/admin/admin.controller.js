const { json } = require('body-parser');
const{getBookingsAdminHome,updateAgentAmount}=require('./admin.service');
module.exports={
    getBookingsAdminHome:async(pageId)=>{   
        let data=await getBookingsAdminHome(pageId); 
         console.log("datares*=="+JSON.stringify(data));
         return data;    
    },
    updateAgentAmount:async(amount,bookingId)=>{
        let data=await updateAgentAmount(amount,bookingId); 
         console.log("datares*=="+JSON.stringify(data));
         return data;          
    }

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