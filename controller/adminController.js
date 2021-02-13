const AdminModel = require('../models/adminModel');
var validator = require("email-validator");
var adminController = {
    loginPage:loginPage,
    registerPage:registerPage,
    // login:login,
 }


 function loginPage(req,res) {
    AdminModel.getUser().then((data)=>{
        // data=JSON.stringify(data);
        // data=JSON.parse(data);
        data=data[0].username
        res.render('pages/index',{data:data})
    });
}

function registerPage(req,res) {
    let {name,contact,email,password}=req.body;
    var arr =[];
    if(name=='' || contact=='' || email =='' || password ==''){
        arr.push('All Fields Are Mandatory...')
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

// function login(req,res) {
//     let {name,id}=req.body;
//     res.render('pages/index',{data:name})
// }


module.exports= adminController;