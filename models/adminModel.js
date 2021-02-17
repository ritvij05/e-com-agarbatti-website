const connectDB = require("../config/db");
var bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require('dotenv').config();

// nodemailer
const nodemailer = require("nodemailer");
// transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.Gmail_user,
    pass: process.env.Gmail_pass,
  },
});


var AdminModel = {};



// @desc   Authenticate user & get token
// @access Public
AdminModel.login = function(request, result){
  connectDB.query(`SELECT * FROM admins WHERE email = '${request.email}' LIMIT 1`, (error, results) => {
    let msg;
    let data;
    if(error) {
        msg='error';
        data={msg,error}
        return result(data); }
    if(results.length){
        if(results[0].status!==1) return result('Account Not Verified...');
        if( bcrypt.compareSync(request.password, results[0].password)){
            msg='login Successful...';

            const payload = {
                user: {
                  id: results[0].id,
                },
              };
              jwt.sign(
                payload,
                process.env.jwtSecret,
                { expiresIn: 360000 },
                (err, token) => {
                  if (err) throw err;
                data={msg,results,token}
                    return result(data);
                }
              );

        }
        else{
            return result('Password Does Not Match...');
        }
    }
    else{
      return result('Email Not Found...');
    }
  });
}

// @desc   Change User Password
// @access Private
AdminModel.forgotPass=function(email,result) {
    connectDB.query(`SELECT  COUNT(*) as cnt FROM admins WHERE email ='${email}'`, function (err, res) {
        if(err) return result(err);
        if(!res[0].cnt) return result('Email Not Found...');
    try {
        const payload = {
            user: {
              email:email,
            },
          };
        const emailToken = jwt.sign(payload, process.env.jwtSecret, {
          expiresIn: 360000,
        });
        const url = `http://localhost:5000/admin/ChangePass/${emailToken}`;
        var mailOptions = {
          from: process.env.Gmail_user,
          to: email,
          subject: "Change Account Passowrd.",
          html: `Please Click On The Following Link To Change You'r Account Password: <br><br><a href="${url}">Click Here To Change Password</a>`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            return result(error);
          } else {
            return result('Password Change Link Sent Successfully...');
          }
        });
      } catch (error) {
        return result(error);
      }
    });
}

// @desc   Update User Password
// @access Private
AdminModel.updatePass=function(payload,result) {
    payload.password=  bcrypt.hashSync(payload.password, saltRounds);
    connectDB.query(`update admins set password='${payload.password}' where email='${payload.email}'`, function (err, res) {
        if(err) return result(err);
        return result('Password Updated Successfully...');
    });

}



// @desc   Register User
// @access Private
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
                        try {
                            const jwtpayload = {
                                user: {
                                  email:payload.email,
                                },
                              };
                            const emailToken = jwt.sign(jwtpayload, process.env.jwtSecret, {
                              expiresIn: 360000,
                            });
                            const url = `http://localhost:5000/admin/confirmation/${emailToken}`;
                            var mailOptions = {
                              from: process.env.Gmail_user,
                              to: payload.email,
                              subject: "Confirmation Email!",
                              html: `Please Click On The Following Link To Verify You'r Account: <br>Your Name: "${payload.name}"<br><a href="${url}">Click Here To Confirm Email</a>`,
                            };
                            transporter.sendMail(mailOptions, function (error, info) {
                              if (error) {
                                connectDB.query(`delete from admins where email='${payload.email}'`);
                                return result(error);
                              } else {
                                return result('Admin Added Successfully...');
                              }
                            });
                          } catch (error) {
                            return result(error);
                          }
                    }
                });
            }
        });

}


// @desc   Verify User Account
// @access Private
AdminModel.verifyUser = function(request, result){
    connectDB.query(`update admins set status = 1 where email='${request.user.email}'`, function (err, res) {
        if(err) return result(err);
        return result('Account Verified Successfully...');

});
}

// Manage Products & Categories


// @desc   Verify User Account
// @access Private
AdminModel.manageCat = function(data,result){
  if(data.type=='add'){
    connectDB.query(`insert into categories (name) values ('${data.name}')`,(err,results)=>{
      if(err) return result(err);
      return result('Category Addition Successful...');
    });
  }else if(data.type=='update'){
    connectDB.query(`update categories set name='${data.name}' where id='${data.id}'`,(err,results)=>{
      if(err) return result(err);
      return result('Category Updation Successful...');
    });
  }else{
    connectDB.query(`delete from categories where name='${data.name}' and id='${data.id}'`,(err,results)=>{
      if(err) return result(err);
      return result('Category Deletion Successful...');
    });
  }
}


module.exports = AdminModel;
