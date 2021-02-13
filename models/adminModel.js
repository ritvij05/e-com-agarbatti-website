const connectDB = require("../config/db");
var bcrypt = require("bcrypt");
const saltRounds = 10;

var AdminModel = {
    // getUser:getUser,
    // registerAdmin:registerAdmin
 }

 AdminModel.getUser=function(data) {
     // return new Promise((resolve,reject) => {
         connectDB.query("SELECT * from admins",(error,results)=>{
            if(error) {
                return data(error);
            } else {
                return data(results);
            }
          });
     //    });
 }

AdminModel.login = function(request, result){
  request.password = bcrypt.hashSync(request.password, saltRounds);
  connectDB.query(`SELECT * FROM admins WHERE email = '${request.email}' AND password = '${request.password}' LIMIT 1`, (error, results) => {
    if(error){
      return result(error);
    }
    if(results[0].cnt == 1){
      return result('Login succesful');
    }
    else{
      return result('No or more than one record found');
    }
  });
}

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
