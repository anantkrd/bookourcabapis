const { json } = require('body-parser');
const{create,getCabs,getBookingsForAgent,getMyBookings,getMyCompletedBookings}=require('./agent.service');
const{createUser,getUserByMobile}=require('../user/user.controller');
module.exports={
    getBookingsForAgent:async(agentId,pageId=1)=>{
        //console.log("Here in controleler");
        let results=await getBookingsForAgent(agentId,pageId); 
         //console.log("datares*=="+JSON.stringify(datares));
         if(results.length<=0){
            responce=JSON.stringify({code:'500',msg:'No Data found',data:''});
        }else{
            
            responce=JSON.stringify({code:'200',msg:'',data:results});
        }
         return responce;        
    },
    getMyBookings:async(agentId,pageId=1)=>{
        //console.log("Here in controleler");
        let results=await getMyBookings(agentId,pageId); 
         //console.log("datares*=="+JSON.stringify(datares));
         if(results.length<=0){
            responce=JSON.stringify({code:'500',msg:'No Data found',data:''});
        }else{
            
            responce=JSON.stringify({code:'200',msg:'',data:results});
        }
         return responce;        
    },
    getMyCompletedBookings:async(agentId,pageId=1)=>{
        //console.log("Here in controleler");
        let results=await getMyCompletedBookings(agentId,pageId); 
         //console.log("datares*=="+JSON.stringify(datares));
         if(results.length<=0){
            responce=JSON.stringify({code:'500',msg:'No Data found',data:''});
        }else{
            
            responce=JSON.stringify({code:'200',msg:'',data:results});
        }
         return responce;        
    },
    
}