const express =require('express')
const router = express.Router();
const { Router } = require('express');
const adminControlers = require('../controllers/adminControlers')
const JoiValidator = require ('../controllers/joiControllers')
const store = require('../middleware/productMulter')
const Bannerstorage = require('../middleware/BannerMulter')

router.get('/',adminControlers.loginView)

router.post('/', JoiValidator.validateAdmin,adminControlers.adminLogin)

router.get('/dashbord',adminControlers.adminSessionCheck,adminControlers.dashbordView)

router.get('/product',adminControlers.adminSessionCheck,adminControlers.productList)

router.post('/add-product',store.array('productImage',3),adminControlers.postaddProducts)

router.post('/delProduct/:id',adminControlers.deletproduct)

router.get('/edit-product',adminControlers.adminSessionCheck,adminControlers.getEditProducr)

router.post('/edit-product',store.array('productImage',3),adminControlers.postEditProduct)

router.get('/account',adminControlers.adminSessionCheck,adminControlers.userList)

router.get('/blockUser/:id',adminControlers.adminSessionCheck,adminControlers.blockUser)

router.get('/unblockUser/:id',adminControlers.adminSessionCheck,adminControlers.unblockUser)

router.get('/add-product',adminControlers.adminSessionCheck,adminControlers.addProductView)

router.get('/adminCategory',adminControlers.adminSessionCheck,adminControlers.getCategory)

router.post('/adminCategory',adminControlers.postadmincategory)

router.post('/delCategory/:category',adminControlers.deletCatagory)

router.get('/categorizedProducts/:category',adminControlers.adminSessionCheck,adminControlers.getCateProduct)

router.get('/adminlogout',adminControlers.adminSessionCheck,adminControlers.adminLogout)

router.get('/orders',adminControlers.adminSessionCheck,adminControlers.getOrderlist)

router.post('/order-status',adminControlers.adminSessionCheck,adminControlers.changeTrack)

router.get('/banners',adminControlers.adminSessionCheck,adminControlers.getBanner)

router.get('/addBanner',adminControlers.adminSessionCheck,adminControlers.getAddBanner)

router.post('/addBanner',adminControlers.adminSessionCheck,Bannerstorage.single('BannerImages'),adminControlers.postAddBanner)

router.delete('/removeBanner/:id',adminControlers.adminSessionCheck,adminControlers.deletBanner)

router.get('/couponList',adminControlers.adminSessionCheck,adminControlers.getCouponList)

router.get('/addcoupon',adminControlers.adminSessionCheck,adminControlers.getAddCoupon)

router.post('/addcoupon',adminControlers.adminSessionCheck,adminControlers.postAddCoupon)

router.get('/couponActivate',adminControlers.adminSessionCheck,adminControlers.CouponActive)

router.get('/couponBlock',adminControlers.adminSessionCheck,adminControlers.blockCoupon)

router.get('/couponDelete',adminControlers.adminSessionCheck,adminControlers.deleteCoupon)

module.exports = router ;

