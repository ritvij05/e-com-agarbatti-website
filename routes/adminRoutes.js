const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const adminController = require('../controller/adminController');



router.get('/', adminController.showLoginPage);
router.get('/login',adminController.showLoginPage);
router.post('/login', adminController.login);
router.get('/logout', adminController.logout);

router.post('/forgotPass',adminController.forgotPass);
router.get('/changePass/:token',[auth,adminController.changePass]);
router.post('/changePass/:token',[auth,adminController.updatePass]);

router.get('/register', adminController.showRegisterPage);
router.post('/register', adminController.registerPage);
router.get('/confirmation/:token',[auth,adminController.verifyUser]);

// router.get();
router.get('/dashboard',adminController.dashboard);
router.get('/categories/manage',adminController.showCategories);
router.post('/categories/manage',adminController.manageCategories);
// router.post('/categories/create',adminController.storeCategory);
router.get('/categories/edit/:id',adminController.editCategory);
// router.post('/categories/edit/:id',adminController.updateCategory);
// router.post('/categories/delete',adminController.deleteCategory);

// product routes
router.get('/products/manage',adminController.manageProducts);
router.get('/products/create',adminController.createProduct);
router.post('/products/create',adminController.storeProduct);
router.get('/products/edit/:id',adminController.editProduct);
router.get('/products/editImage/:id',adminController.editProductImage);
router.post('/products/upload/:id',adminController.uploadImages);
router.post('/products/edit/:id',adminController.updateProduct);
router.post('/products/delete',adminController.deleteProduct);
router.post('/products/deleteImage',adminController.deleteProductImage);

// queries routes
router.get('/queries/manage',adminController.manageQueries);
router.get('/queries/write/:id',adminController.writeQueryResponse);
router.post('/queries/submit',adminController.submitQueryResponse);

module.exports = router;
