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

// router.get('/register', [auth,adminController.showRegisterPage]);
router.post('/register/:token',[auth, adminController.registerPage] );
router.get('/confirmation/:token',[auth,adminController.verifyUser])

module.exports = router;
