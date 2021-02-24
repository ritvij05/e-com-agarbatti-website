const AdminModel = require('../models/adminModel');
var validator = require("email-validator");

const upload = require("../middleware/upload");
const fs = require('fs-extra');

var adminController = {
    showLoginPage:showLoginPage,
    showRegisterPage:showRegisterPage,
    registerPage:registerPage,
    login:login,
    logout:logout,
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
    editProductImage:editProductImage,
    updateProduct:updateProduct,
    deleteProduct:deleteProduct,
    uploadImages:uploadImages,
 }


function showLoginPage(req,res) {
    if(req.session.admin){
        res.render('pages/admin/dashboard')
    }else{
        res.render('pages/admin/login');
    }
}

function showRegisterPage(req,res) {
    if(req.session.admin){
        res.render('pages/admin/register')
    }else{
        res.render('pages/admin/login');
    }
}

function dashboard(req, res){
  // check for user
  if(req.session.admin){
    res.render('pages/admin/dashboard')
}else{
    res.render('pages/admin/login');
}
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
              let name=result.results.name;
              let id=result.results.id;
              let admin={
              id,
              name,
              email,
              }
              // res.setHeader('x-auth-token', token);
              req.session.admin=admin;
              req.flash('success', 'Login Succesful');
              res.redirect('/admin/dashboard');
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

function logout(req,res){
  // req.session.destroy();
  delete req.session.admin;
  req.flash('success', 'Logout!');
  res.redirect('/admin/login');
};

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
   let {type,name,id}=req.body; //send null id only while adding category
   if(type=='delete'){
    id=req.body.deleteid;
   }
   data={type,id,name};
   if(type =='' || name=='') res.json({err:'All Fields Are Mandatory...'});
   AdminModel.manageCategories(data,function(result){
        if(result.includes("UnSuccessful...")){
          req.flash('error', result);
          res.redirect('/admin/categories/manage');
        }
        else{
        req.flash('success', result);
        res.redirect('/admin/categories/manage');
        }
   });
}


// categories
function showCategories(req, res){
  // get all categories here
  AdminModel.showCategories(function(result){
    if(result=='error'){
      req.flash('error', 'Unable To Load Categories...');
      res.redirect('/admin/dashboard');
    }
    res.render('pages/admin/manage-categories',{categories:result});
  });

}

function storeCategory(req, res){
  // store category here
  // returning to manage page for now
  req.flash('success', 'Category added successfully');
  res.redirect('/admin/categories/manage');
}

function editCategory(req, res){
  AdminModel.editCategory(req,function(result){
    if(result=='error'){
      req.flash('error', 'Unsuccessful...');
      res.redirect('/admin/categories/manage');
    }
    res.render('pages/admin/edit-category',{categories:result});
  });
 
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
  AdminModel.manageProducts(function(result){
    if(result=='error'){
      req.flash('error', 'Unsuccessful');
      res.redirect('/admin/dashboard');
    }else{
      AdminModel.showCategories(function(data){
        if(result=='error'){
          req.flash('error', 'Unsuccessful');
          res.redirect('/admin/dashboard');
        }
        // console.log(result[0]);
        res.render('pages/admin/manage-products',{products:result,categories:data});
      });
    }
  });
  
}

function createProduct(req, res){
  // categories list, companies list
  AdminModel.showCategories(function(result){
    if(result=='error'){
      req.flash('error', 'Unsuccessful');
      res.redirect('/admin/products/manage');
    }
    else{
    res.render('pages/admin/create-product',{categories:result});
    }
  });
}

function uploadImages(req,res){
  var dir = './public/images/products/'+req.params.id;
  if(!fs.existsSync(dir))
  {
    fs.mkdirs(dir, function (err) {
        if (err) {
          req.flash('error', 'Unsuccessful...');
          res.redirect('/admin/products/manage');
        } 
      });
  }
  upload(req, res,function(err){
    if (err) {
      // fs.rmdir('./public/images/products/'+req.params.id);
      req.flash('error', 'Unsuccessful...');
      res.redirect('/admin/products/manage');
    }
    else{
      // console.log(req.files[0].filename);
      AdminModel.uploadImages(req,function(result){
        if(result!=='Product Images Added...'){
          // fs.rmdir('./public/images/products/'+req.params.id);
          req.flash('error', 'Unsuccessful...');
          res.redirect('/admin/products/manage');
        }
        req.flash('success', 'Product Images added successfully...');
        res.redirect('/admin/products/manage');
      });
    }
  });
};


function storeProduct(req, res){
  // store product here
  // returning to manage page for now
  let {name,company_name,description,in_stock,actual_price,discounted_price,category_id}=req.body;
  var arr =[];
  if(name=='' || company_name=='' || description=='' || in_stock=='' || actual_price==''  || category_id==''){
    arr.push("Please fill in all the fields first");
  }
  if(in_stock!=='1'){
    in_stock='0';
  }
  let data={ name,
      company_name,
      description,
      in_stock,
      actual_price,
      discounted_price,
      category_id,
      }
  if(arr.length){
    req.flash('error', arr[0]);
    res.redirect('/admin/products/create');
  }
  else{
      AdminModel.storeProduct(data,function(result){
          if(result == 'Product Addition Successful...'){
            req.flash('success', 'Product Addition Successful...');
            res.redirect('/admin/products/manage');
          }
          else{
          req.flash('error'," Product Addition UnSuccessful...");
          res.redirect('/admin/products/create');
          }
      });
  }
//   req.flash('success', 'Product added successfully');
//   res.redirect('/admin/products/manage');
}

function editProductImage(req, res){
  res.render('pages/admin/test',{id:req.params.id});
}

function editProduct(req, res){
  AdminModel.editProduct(req,function(result){
    if(result=='error'){
      req.flash('error', 'Unsuccessful...');
      res.redirect('/admin/products/manage');
    }
    AdminModel.showCategories(function(data){
      if(result=='error'){
        req.flash('error', 'Unsuccessful...');
        res.redirect('/admin/products/manage');
      }
      // console.log(result[0]);
      res.render('pages/admin/edit-product',{products:result[0],categories:data});
    });
  });
}


function updateProduct(req, res){
    // store product here
  // returning to manage page for now
  let {name,company_name,description,in_stock,actual_price,discounted_price,category_id,has_discount}=req.body;

  var arr =[];
  if(name=='' || company_name=='' || description=='' || in_stock=='' || actual_price==''  || category_id==''){
    arr.push("Please fill in all the fields first");
  }
  if(in_stock!=='1'){
    in_stock='0';
  }
  if(has_discount!=='1'){
    discounted_price=0;
  }
  let id=req.params.id;
  let data={ name,
      company_name,
      description,
      in_stock,
      actual_price,
      discounted_price,
      category_id,
      id,
      }
  if(arr.length){
    req.flash('error', arr[0]);
    res.redirect('/admin/products/edit/'+req.params.id);
  }
  else{
      AdminModel.updateProduct(data,function(result){
          if(result == 'Product Update Successful...'){
            req.flash('success', result);
            res.redirect('/admin/products/manage');
          }
          else{
          req.flash('error'," Product Update UnSuccessful...");
          res.redirect('/admin/products/edit/'+req.params.id);
          }
      });
  }
}

function deleteProduct(req, res){
  let{deleteid}=req.body;
  AdminModel.deleteProduct(deleteid,function(result){
            if(result=='error'){
              req.flash('error', 'Product Deletion UnSuccessfully...');
              res.redirect('/admin/products/manage');
            }else{
            fs.rmdir('./public/images/products/'+deleteid, { recursive: true });
            req.flash('success', 'Product Deletion Successfully...');
            res.redirect('/admin/products/manage');
            }
       });
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
