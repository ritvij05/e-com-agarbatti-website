const connectDB = require("../config/db");
var bcrypt = require("bcrypt");
const saltRounds = 10;

var AdminModel = {
    // getUser:getUser,
    // registerAdmin:registerAdmin
 }

// function getUser() {
//     return new Promise((resolve,reject) => {
//         connectDB.query("Select * from login",(error,results)=>{
//            if(error) {   
//                reject(error);
//            } else {
//                resolve(results);
//            }
//          });
//        });
// }

AdminModel.registerAdmin=function(payload,result) {
        
        connectDB.query(`SELECT  COUNT(*) as cnt FROM admins WHERE email ='${payload.email}' or contact='${payload.contact}'`, function (err, res) {
            
            if (err) return result(err);
            if(res[0].cnt >0){ 
                return result('Email/Contact Already Exists...');
            }
            else{
               
                payload.password=  bcrypt.hashSync(payload.password, saltRounds);
                connectDB.query(`insert into admins (name,contact,email,password) values('${payload.name}','${payload.contact}','${payload.email}','${payload.password}')`,(err,results)=>{
                    if(err) {   
                        return result(err);
                    } else {

                        return result('Admin Added Successfully...');
                    }
                });
            }   
        });
    
}

// function registerAdmin(payload) {
//     return new Promise((resolve,reject) => {
//         connectDB.query(`SELECT  COUNT(*) as cnt FROM admins WHERE email ='${payload.email}'`, function (err, result) {
            
//             if (err) reject (err);
//             if(result[0].cnt >0){ 
//                 resolve ('Email Already Exists...');
//             }
//             else{
//                 return new Promise((resolve,reject) => {
//                 payload.password=  bcrypt.hashSync(payload.password, saltRounds);
//                 connectDB.query(`insert into admins (name,contact,email,password) values('${payload.Name}','${payload.contact}','${payload.email}','${payload.password}')`,(err,results)=>{
//                     if(err) {   
//                         reject(err);
//                     } else {
//                         resolve(results);
//                     }
//                 });
//             });
//             }   
//         });
//     });
// }

module.exports = AdminModel;
