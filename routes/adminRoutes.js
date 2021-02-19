const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const adminController = require('../controller/adminController');



router.get('/', adminController.showLoginPage);
router.get('/login',adminController.showLoginPage);
router.post('/login', adminController.login);

router.post('/forgotPass',adminController.forgotPass);
router.get('/changePass/:token',[auth,adminController.changePass]);
router.post('/changePass/:token',[auth,adminController.updatePass]);

router.get('/register', adminController.showRegisterPage);
router.post('/register', adminController.registerPage);
router.get('/confirmation/:token',[auth,adminController.verifyUser]);

// router.get();
router.get('/dashboard',adminController.dashboard);
router.get('/categories/manage',adminController.manageCategories);
router.post('/categories/create',adminController.storeCategory);
router.get('/categories/edit/:id',adminController.editCategory);
router.post('/categories/edit/:id',adminController.updateCategory);
router.post('/categories/delete',adminController.deleteCategory);

// product routes
router.get('/products/manage',adminController.manageProducts);
router.get('/products/create',adminController.createProduct);
router.post('/products/create',adminController.storeProduct);
router.get('/products/edit/:id',adminController.editProduct);
router.post('/products/edit/:id',adminController.updateProduct);
router.post('/products/delete',adminController.deleteProduct);

module.exports = router;
