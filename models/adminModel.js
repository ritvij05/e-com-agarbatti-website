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
        if(results[0].status!==1) return result('not verified');
        if( bcrypt.compareSync(request.password, results[0].password)){
            msg='login successful';

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
            return result('password not found');
        }
    }
    else{
      return result('email not found');
    }
  });
}

// @desc   Change User Password
// @access Private
AdminModel.forgotPass=function(email,result) {
    connectDB.query(`SELECT  COUNT(*) as cnt FROM admins WHERE email ='${email}'`, function (err, res) {
        if(err) return result(err);
        if(!res[0].cnt) return result('no email');
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
            return result('link sent');
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
                              html: `Please Click On The Following Link To Verify Your Account: <br>Your Name: "${payload.name}"<br><a href="${url}">Click Here To Confirm Email</a>`,
                            };
                            transporter.sendMail(mailOptions, function (error, info) {
                              if (error) {
                                connectDB.query(`delete from admins where email='${payload.email}'`);
                                return result(error);
                              } else {
                                return result('admin added');
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

// Categories
// @desc   Manage Categories
// @access Private
AdminModel.manageCategories = function(data,result){
  if(data.type=='add'){
    connectDB.query(`insert into categories (name) values ('${data.name}')`,(err,results)=>{
      if(err){
        console.log(err);
        return result('Category Addition UnSuccessful...');
      }
      return result('Category Addition Successful...');
    });
  }else if(data.type=='update'){
    connectDB.query(`update categories set name='${data.name}' where id='${data.id}'`,(err,results)=>{
      if(err){
        console.log(err);
        return result('Category Updation UnSuccessful...');
      }
      return result('Category Updation Successful...');
    });
  }else{
    connectDB.query(`delete from categories where id='${data.id}'`,(err,results)=>{
      if(err){
        console.log(err);
        return result('Category Deletion UnSuccessful...');
      }
      return result('Category Deletion Successful...');
    });
  }
}

//@desc Get All categores
AdminModel.showCategories = function(result){
  connectDB.query(`select * from categories`,(err,results)=>{
    if(err) {
      console.log(err)
      return result('error');
    }
    return result(results);
  });

}

//@desc Get single categores
AdminModel.editCategory = function(req,result){
  connectDB.query(`select * from categories where id='${req.params.id}'`,(err,results)=>{
    if(err) {
      console.log(err)
      return result('error');
    }
    return result(results);
  });

}

// products
// @desc   Store Products
// @access Private
AdminModel.storeProduct = function(data,result){
    connectDB.query(`insert into products (category_id,name,company_name,description,in_stock,actual_price,discount_price)values ('${data.category_id}','${data.name}','${data.company_name}','${data.description}','${data.in_stock}','${data.actual_price}','${data.discounted_price}')`,(err,results)=>{
      if(err) {
        console.log(err);
        return result('error');
      };
      return result('Product Addition Successful...');
    });

}

// @desc   Update Products
// @access Private
AdminModel.updateProduct = function(data,result){
  connectDB.query(`update products set category_id='${data.category_id}',name='${data.name}',company_name='${data.company_name}',description='${data.description}',in_stock='${data.in_stock}',actual_price='${data.actual_price}',discount_price='${data.discounted_price}' where id='${data.id}'`,(err,results)=>{
    if(err) {
      console.log(err);
      return result('error');
    };
    return result('Product Update Successful...');
  });

}

//@desc Get All products
AdminModel.manageProducts = function(result){
  connectDB.query(`select * from products`,(err,results)=>{
    if(err) {
      console.log(err)
      return result('error');
    }

    for(var i=0; i< results.length; i++){
      if(results[i].images){
        results[i].images=results[i].images.split(",");
      }
    }
    return result(results);
  });

}

//@desc Get single Product !!!yesssss
AdminModel.getProduct = function(req,result){
  connectDB.query(`select * from products where id='${req.params.id}'`,(err,results)=>{
    if(err) {
      console.log(err)
      return result('error');
    }
    return result(results);
  });
}

//@desc delete product
AdminModel.deleteProduct = function(id,result){
  connectDB.query(`delete from products where id='${id}'`,(err,results)=>{
    if(err) {
      console.log(err);
      return result('error');
    }
    return result('Product Deletion Successful');
  });

}

//@desc Upload/Update Images
AdminModel.uploadImages = function(request,result){
  connectDB.query(`select images from products where id='${request.params.id}'`,(err,results)=>{
    let arr =[];
    if(err){
      return result(err);
    }else{
      if(results[0].images){
        var images = results[0].images;
        images = images.split(",");
        // arr.push(JSON.parse(results[0].images))
        arr = arr.concat(images);
      }
      for(var i = 0; i < request.files.length; i++){
        // breaking the loop if array length is more than 10
        if(arr.length >= 10){
          break;
        }
        arr.push(request.params.id+'/'+request.files[i].filename);
        // arr.push(request.files[i].filename)
      }
      // console.log(arr);
    }
    // let path='/images/products/'+request.params.id;
    connectDB.query(`update products set images='${arr}' where id='${request.params.id}'`,(err,results)=>{
      if(err) return result(err);
      return result('Product Images Added...')
    });
  });
}

AdminModel.deleteImage = function(request,result){
  connectDB.query(`select images from products where id='${request.body.id}'`,(err,results)=>{
    if(err){
      return result(err);
    }else{
      if(results[0].images){
        var images = results[0].images;
        images = images.split(",");
        var i = images.indexOf(request.body.name);
        if(i != -1){
          images.splice(i, 1);
        }
        if(images.length == 0){
          connectDB.query(`update products set images = NULL where id='${request.body.id}'`,(err,results)=>{
            if(err) return result(err);
            return result('image deleted');
          });
        }
        else{
          connectDB.query(`update products set images='${images}' where id='${request.body.id}'`,(err,results)=>{
            if(err) return result(err);
            return result('image deleted');
          });
        }
        // arr.push(JSON.parse(results[0].images))
      }
    }
    // let path='/images/products/'+request.body.id;
  });
}

AdminModel.getQueries = function(result){
  connectDB.query(`select * from queries`,(err,results)=>{
    if(err) {
      console.log(err)
      return result('error');
    }
    return result(results);
  });
}

AdminModel.getQuery = function(req,result){
  connectDB.query(`select * from queries where id='${req.params.id}'`,(err,results)=>{
    if(err) {
      console.log(err)
      return result('error');
    }
    return result(results);
  });
}

AdminModel.updateQuery = function(req,result){
  connectDB.query(`update queries set status = '1' where id='${req.body.id}'`,(err,results)=>{
    if(err) {
      return result('error');
    }
    return result('query updated');
  });
}


module.exports = AdminModel;
