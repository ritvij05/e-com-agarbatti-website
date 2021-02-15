const userModel = require('../models/userModel');
var validator = require("email-validator");

var userController = {
    userQuery:userQuery
 }

 function userQuery(req,res){
     let {name,email,question,order_id}=req.body;
     var arr =[];
     if(name=='' || email=='' || question=='' || order_id==''){
         arr.push('All Fields Are Mandatory...');
     }
     if(validator.validate(email)==false){
        arr.push('Email Not Valid...')
    }
    if(arr.length){
        res.status(400).json({error: arr[0]});
    }else{
        let data={name,email,question,order_id};
        userModel.userQuery(data, function(result){
            res.json({data:result});
        });
    }
 }


 module.exports= userController;


