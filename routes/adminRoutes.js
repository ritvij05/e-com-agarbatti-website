const express = require("express");
const router = express.Router();


const adminController = require('../controller/adminController');



router.get('/', adminController.loginPage );
router.post('/register', adminController.registerPage );
// router.post('/login', adminController.login);

module.exports = router;