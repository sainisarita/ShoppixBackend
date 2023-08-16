const express = require('express');
const router = express.Router();
const userController = require("../controllers/user");
const validation=require('../validation/dataValidation')

router.post("/register",validation.registration, userController.postRegistration);
router.post('/login',validation.login,userController.postLogin);
// router.post('/logout' ,userController.postLogin);

module.exports = router;
