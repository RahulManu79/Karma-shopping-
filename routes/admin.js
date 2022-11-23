const express =require('express')
const router = express.Router();
const { Router } = require('express');
const adminControlers = require('../controllers/adminControlers')
const JoiValidator = require ('../controllers/joiControllers')
const store = require('../middleware/productMulter')

router.get('/',adminControlers.loginView)

router.post('/', JoiValidator.validateAdmin,adminControlers.adminLogin)

router.get('/dashbord',adminControlers.dashbordView)

router.get('/product',adminControlers.productList)

router.post('/add-product',store.array('productImage',3),adminControlers.postaddProducts)

router.post('/delProduct/:id',adminControlers.deletproduct)

router.get('/edit-product',adminControlers.getEditProducr)

router.post('/edit-product',store.array('productImage',3),adminControlers.postEditProduct)

router.get('/account',adminControlers.userList)

router.get('/blockUser/:id',adminControlers.blockUser)

router.get('/unblockUser/:id',adminControlers.unblockUser)

router.get('/add-product',adminControlers.addProductView)

router.get('/adminCategory',adminControlers.getCategory)

router.post('/adminCategory',adminControlers.postadmincategory)

router.post('/delCategory/:category',adminControlers.deletCatagory)

router.get('/categorizedProducts/:category',adminControlers.getCateProduct)

router.get('/adminlogout',adminControlers.adminLogout)

router.get('/orders',adminControlers.getOrderlist)





module.exports = router ;

