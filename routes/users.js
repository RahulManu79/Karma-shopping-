
const { Router } = require('express');
const express =require('express');
const { registerUser, sessionchek, loginSessionCheck } = require('../controllers/logincontrollers');
const loginController = require('../controllers/logincontrollers');
const router = express.Router();
const JoiValidator =require('../controllers/joiControllers')


router.get('/register',loginController.registerView)
router.get('/',loginController.View)  
router.get('/create',loginController.createView)

router.post('/register',JoiValidator.validateRegister, loginController.registerUser )
router.post('/',JoiValidator.validateLogin,loginController.loginUser)

router.get('/home',loginController.homeView)
router.get('/login',loginController.loginbtnView)
router.get('/logout',loginController.logoutView)
module.exports=router