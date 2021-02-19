const AdminModel = require('../models/adminModel');
var validator = require("email-validator");

var adminController = {
    showLoginPage:showLoginPage,
    showRegisterPage:showRegisterPage,
    registerPage:registerPage,
    login:login,
    verifyUser:verifyUser,
    forgotPass:forgotPass,
    changePass:changePass,
    updatePass:updatePass,
    dashboard:dashboard,
    showCategories:showCategories,
    manageCategories:manageCategories,
    storeCategory:storeCategory,
    editCategory:editCategory,
    updateCategory:updateCategory,
    deleteCategory:deleteCategory,
    manageProducts:manageProducts,
    createProduct:createProduct,
    storeProduct:storeProduct,
    editProduct:editProduct,
    updateProduct:updateProduct,
    deleteProduct:deleteProduct,
 }


function showLoginPage(req,res) {
    if(req.user){
        res.render('pages/admin/dashboard')
    }else{
        res.render('pages/admin/login');
    }
}

function showRegisterPage(req,res) {
    if(req.user){
        res.render('pages/admin/dashboard')
    }else{
        res.render('pages/admin/register');
    }
}

function dashboard(req, res){
  // check for user
  res.render('pages/admin/dashboard');
}

function changePass(req,res) {
    // if(req.user){
    //     res.render('pages/admin/updatePass')
    // }else{
    //     res.render('pages/admin/login');
    // }
    res.render('pages/admin/change-password');
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
    var st="";
    if(email=='' || password==''){
      st = "Please fill in all the fields \n";
    }
    if(validator.validate(email)==false){
      st = "Email not valid \n";
    }
    if(st != ""){
      req.flash('error', st);
      res.redirect('/admin/login');
      return;
    }
    else{
        AdminModel.login(req.body, function(result){
            if(result == 'not verified'){
              req.flash('error', 'Account not verified, Please check your mail!');
              res.redirect('/admin/login');
              return;
            }
            else if(result == 'email not found'){
              req.flash('error', 'Invalid Email');
              res.redirect('/admin/login');
              return;
            }
            else if(result == 'password not found'){
              req.flash('error', 'Invalid Password');
              res.redirect('/admin/login');
              return;
            }
            else if(result.msg == "login successful"){
              req.flash('success', 'Login Succesful');
              res.redirect('/admin');
              return;
            }
            else{
              req.flash('error', 'Some error occured');
              res.redirect('/admin/login');
              return;
            }
        });
    }
}

function forgotPass(req,res) {
    let {email }=req.body;
    if(validator.validate(email)==false) res.status(400).json({error:'Email Not Valid!'});
    AdminModel.forgotPass(email,function(result){
        if(result == "no email"){
          req.flash('error', 'Email not found!');
          res.redirect('/admin/login');
          return;
        }
        else if(result == "link sent"){
          req.flash('success', 'Password reset link sent successfully!');
          res.redirect('/admin/login');
          return;
        }
    })
}

function registerPage(req,res) {
    let {name,contact,email,password}=req.body;
    var arr =[];
    var st = "";
    if(name=='' || contact=='' || email =='' || password ==''){
      st = "Please fill in all the fields first \n";
    }
    if(validator.validate(email)==false){
      st = "Invalid email \n";
    }
    if(isNaN(contact) || contact.length !==10){
      st = "Invalida contact number \n";
    }
    if(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(password) == false){
      st = "Password must match the required pattern \n";
    }
    let payload ={ name,
                contact,
                email,
                password,
                 }
    if(st != ""){
      req.flash('error', st);
      res.redirect('/admin/register');
    }
    else{
        AdminModel.registerAdmin(payload,function(result){
            if(result == 'admin added'){
              req.flash('success', 'Registration Successful');
              res.redirect('/admin/login');
              return;
            }
        });
    }
}

function verifyUser(req,res)
{
    AdminModel.verifyUser(req,function(result){
        res.json({data:result});
    });
}

// Manage Products & Categories
function manageCategories(req,res)
{                               // type -> send... add,del,update
   let {type,id,name}=req.body; //send null id only while adding category
   data={type,id,name};
   if(type =='' || name=='') res.json({err:'All Fields Are Mandatory...'});
   AdminModel.manageCategories(data,function(result){
        res.json({data:result});
   });
}


// categories
function showCategories(req, res){
  // get all categories here
  res.render('pages/admin/manage-categories');
}

function storeCategory(req, res){
  // store category here
  // returning to manage page for now
  req.flash('success', 'Category added successfully');
  res.redirect('/admin/categories/manage');
}

function editCategory(req, res){
  res.render('pages/admin/edit-category');
}

function updateCategory(req, res){
  // store product here
  // returning to manage page for now
  req.flash('success', 'Category updated successfully');
  res.redirect('/admin/categories/manage');
}

function deleteCategory(req, res){
  req.flash('error', 'Category deleted successfully');
  res.redirect('/admin/categories/manage');
}

// products
function manageProducts(req, res){
  // get all products here
  res.render('pages/admin/manage-products');
}

function createProduct(req, res){
  // categories list, companies list
  res.render('pages/admin/create-product');
}

function storeProduct(req, res){
  // store product here
  // returning to manage page for now
  req.flash('success', 'Product added successfully');
  res.redirect('/admin/products/manage');
}

function editProduct(req, res){
  res.render('pages/admin/edit-product');
}

function updateProduct(req, res){
  // store product here
  // returning to manage page for now
  req.flash('success', 'Product updated successfully');
  res.redirect('/admin/products/manage');
}

function deleteProduct(req, res){
  req.flash('error', 'Product deleted successfully');
  res.redirect('/admin/products/manage');
}

// function manageProducts(req,res)
// {                                // type -> send... add,del,update
//    let {type,id,categoty_id,name,company_name,description,images,in_stock,actual_price,discount_price,purchased_count}=req.body; //send null id only while adding category
//    data={type,id,name};
//    if(type =='' || name=='') res.json({err:'All Fields Are Mandatory...'});
//    AdminModel.manageCategories(data,function(result){
//         res.json({data:result});
//    });
// }


module.exports= adminController;
