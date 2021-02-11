const connectDB = require("../config/db");

var AdminModel = {
    getUser:getUser,
 }

function getUser() {
    return new Promise((resolve,reject) => {
        connectDB.query("Select * from login",(error,results)=>{
           if(error) {   
               reject(error);
           } else {
               resolve(results);
           }
         });
       });
}

module.exports = AdminModel;
