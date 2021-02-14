const AdminModel = require('../models/adminModel');
var validator = require("email-validator");

var adminController = {
    showLoginPage:showLoginPage,
    registerPage:registerPage,
    login:login,
    verifyUser:verifyUser,
    forgotPass:forgotPass,
    changePass:changePass,
    updatePass:updatePass
 }


function showLoginPage(req,res) {
    if(req.user){
        res.render('pages/dashboard')
    }else{
        res.render('pages/login');
    }
}

function changePass(req,res) {
    if(req.user){
        res.render('pages/updatePass')
    }else{
        res.render('pages/login');
    }
}

function updatePass(req,res) {
    let{password}=req.body;
    if(password==''){
        res.status(400).json({error: 'Password Invalid...'});
    }
    let email=req.user.email;
    let payload ={email,password};
    AdminModel.updatePass(payload,function(result){
        res.json({data:result});
    });
}

function login(req, res){
    let {email,password}=req.body;
    var arr=[];
    if(email=='' || password==''){
        arr.push('All Fields Are Mandatory...');
    }
    if(validator.validate(email)==false){
        arr.push('Email Not Valid...')
    }
    if(arr.length){
        res.status(400).json({error: arr[0]});
    }else{
        AdminModel.login(req.body, function(result){
            res.json({data:result});
        });
    }
}

function forgotPass(req,res) {
    let {email }=req.body;
    if(validator.validate(email)==false) res.status(400).json({error:'Email Not Valid...'});
    AdminModel.forgotPass(email,function(result){
        res.json({data:result});
    })
}

function registerPage(req,res) {
    let {name,contact,email,password}=req.body;
    var arr =[];
    if(name=='' || contact=='' || email =='' || password ==''){
        arr.push('All Fields Are Mandatory...');
    }
    if(validator.validate(email)==false){
        arr.push('Email Not Valid...')
    }
    if(isNaN(contact) || contact.length !==10){
        arr.push('Contact Not Valid...')
    }
    if(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(password) == false){
        arr.push('Password Not Valid...')
    }
    let payload ={ name,
                contact,
                email,
                password,
                 }
    if(arr.length){
        res.status(400).json({error: arr[0]});
    }
    else{
        AdminModel.registerAdmin(payload,function(result){
            res.json({data:result});

        });
    }
}

function verifyUser(req,res)
{
    AdminModel.verifyUser(req,function(result){
        res.json({data:result});
    });
}




module.exports= adminController;
