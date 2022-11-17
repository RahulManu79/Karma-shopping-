
const { Router } = require('express');
const express =require('express');
const { registerUser, sessionchek, loginSessionCheck } = require('../controllers/logincontrollers');
const loginController = require('../controllers/logincontrollers');
const router = express.Router();
const JoiValidator =require('../controllers/joiControllers')

router.use((req,res,next)=>{
    res.locals.cartNum = req.session.cartNum
    next()
})


router.get('/register',loginController.registerView)

router.get('/',loginController.homeView)  

router.get('/create',loginController.createView)

router.post('/register',JoiValidator.validateRegister, loginController.registerUser )

router.post('/',JoiValidator.validateLogin,loginController.loginUser)

router.get('/home',loginController.login)

router.get('/login',loginController.loginbtnView)

router.get('/logout',loginController.logoutView)

router.get('/userProfile',loginController.userprofile)

router.get('/cart',loginController.cartView)

router.get('/cart/:proId',loginController.addToCart)

router.get('/quantityDec/:proid',loginController.QuantityDec)

router.get('/quantityInc/:proid',loginController.QuantityInc)









module.exports=router