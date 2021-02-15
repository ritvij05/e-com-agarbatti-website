const connectDB = require("../config/db");
// var bcrypt = require("bcryptjs");
// const saltRounds = 10;
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


var userModel = {};

userModel.manageCat = function(data,result){
    connectDB.query(`insert into queries (name,email,question,order_id) values('${data.name}','${data.email}','${data.question}','${data.order_id}')`,(err,results)=>{
        if(err) return result(err);
        try {
            connectDB.query(`select * from queries where email='${data.email}' ORDER BY id DESC LIMIT 1`,(err,results)=>{
                if (err) return result(err);
            let queryId = results[0].id;
            var mailOptions = {
              from: process.env.Gmail_user,
              to: data.email,
              subject: "Query Ticket Raised",
              html: `Your Query Has been Register.<br>Your Query ID is '${queryId}'.<br>Our Customer Service Execitive will reach you Shortly!.
                    <br><br>Query ID    :'${queryId}'<br>Question   :'${data.question}'<br>Order ID :'${data.order_id}'`,
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                return result(error);
              } else {
                return result('Query Registered Successfully...');
              }
            });
         });
          } catch (error) {
            return result(error);
          }    
        
    });
}

module.exports = userModel;
