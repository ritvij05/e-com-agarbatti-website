const AdminModel = require('../models/adminModel');

var adminController = {
    loginPage:loginPage,
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

// function login(req,res) {
//     let {name,id}=req.body;
//     res.render('pages/index',{data:name})
// }


module.exports= adminController;