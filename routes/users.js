
const { Router } = require('express');
const express =require('express');
const { registerUser, sessionchek, loginSessionCheck } = require('../controllers/logincontrollers');
const loginController = require('../controllers/logincontrollers');
const WishlistController = require('../controllers/wishListControllers')
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

router.get('/userProfile',loginController.sessionchek,loginController.userprofile)

router.get('/cart',loginController.cartView)

router.get('/cart/:proId',loginController.addToCart)

router.get('/quantityDec/:proid',loginController.QuantityDec)

router.get('/quantityInc/:proid',loginController.QuantityInc)

router.get('/productDetails/:id',loginController.productDetails)

router.get('/removeCart/:id',loginController.removeCart)

router.get('/wishlist',loginController.sessionchek,WishlistController.getWishlist)

router.get('/addToWishlist',loginController.sessionchek,WishlistController.getAddToWishlist)

router.get('/removeWishlist',loginController.sessionchek,WishlistController.removeFromWishlist)

router.get('/checkout',loginController.getCheckOut)

router.post('/checkout/:CartId',loginController.postCheckOut)

router.post('/verifyPayment',loginController.postverifyPayment)

router.post('/paymentFailed',loginController.postPaymentFailed)

router.get('/orderSummary',loginController.postOderSuccess)

router.get('/confirm',loginController.getConfirm )

router.get('/myOrders',loginController.getMyOrders)

router.get('/cancelOrder',loginController.getCancelOrder)





module.exports=router