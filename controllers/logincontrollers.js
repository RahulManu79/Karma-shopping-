const passport = require('passport');
const bcrypt = require('bcryptjs');
const Razorpay = require('razorpay');
const { trusted } = require('mongoose');
const { default: mongoose } = require('mongoose');
const { response } = require('express');
const ShopingCart = require('../models/cartModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const OrderSchema = require('../models/oderModel');
const Address = require('../models/addressModel');
const User = require('../models/user');
const CouponSchema = require('../models/CouponModel');
const {
  validatePaymentVerification,
} = require('../node_modules/razorpay/dist/utils/razorpay-utils');
const Banner = require('../models/bannerMOdel');
const { sendsms, veryfyotp } = require('../middleware/OTP');
var loginErr = null;
var errMsg = null
var regErr
var instance = new Razorpay({
  key_secret: 'zvcqB1phsfyXySVAZoHzObDB',
  key_id: 'rzp_test_EsWfdOrXZua8KY',
});

const otp = require('../middleware/OTP');

module.exports = {
  registerView: (req, res) => {
    if (req.session.user) {
      res.redirect('/home');
    } else {
      res.render('user/register',{regErr, message:null});
    }
  },

  //nouser home view
  homeView: (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/home');
    } else {
      Product.find({})
        .limit(8)
        .then((result) => {
          let user = req.session.user;
          cartNum = req.session.cartNum;
          Banner.find({}).then((response) => {
            // const ashan = result;

            res.render('user/home', { result, response, cartNum });
          });
        });
    }
  },

  //register view
  createView: (req, res) => {
    res.redirect('/register');
  },

  //showing user profile
  userprofile: (req, res) => {
    try {
      let user = req.session.user;
      Address.find({ userId: req.session.user._id }).then((result) => {
        res.render('user/userProfile', {
          user,
          session: req.session,
          addresses: result,
        });
      });
    } catch (err) {
      res.status(429).render('admin/error-429');
    }
  },

  getEditAdress: (req, res) => {
    try {
      let user = req.session.user;
      res.render('user/addAdress', { user, session: req.session });
    } catch (error) {
      res.status(429).render('admin/error-429');
    }
  },

  postEditAdress: async (req, res) => {
    try {
      const address = await Address({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        number: req.body.number,
        email: req.body.email,
        houseName: req.body.houseName,
        homeaddress: req.body.homeaddress,
        city: req.body.city,
        district: req.body.district,
        state: req.body.state,
        country: req.body.country,
        zipcode: req.body.zipcode,
        userId: req.session.user._id,
      });
      address.save().then((result) => {});
      res.redirect('/userProfile');
    } catch (error) {
      res.status(429).render('admin/error-429');
    }
  },

  deleteAdress: async (req, res) => {
    Address.deleteOne({ _id: req.query.id }).then((response) => {
      res.redirect('/userProfile');
    });
  },

  //logged in home view
  login: async (req, res) => {
    if (req.session.loggedIn) {
      const userId = req.session.user._id;
      const viewcart = await ShopingCart.findOne({ userId: userId })
        .populate('products.productId')
        .exec();
      if (viewcart) {
        req.session.cartNum = viewcart.products.length;
      }

      Product.find({})
        .limit(8)
        .then((result) => {
          let user = req.session.user;
          cartNum = req.session.cartNum;
          // ashan = result;
          Banner.find({}).then((response) => {
            res.render('user/home', { user, result, cartNum, response });
          });
        })
        .catch((err) => {
          res.use((req, res) => {
            res.status(429).render('admin/error-429');
          });
        });
    } else {
      res.redirect('/');
    }
  },

  //login page
  loginbtnView: (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/home');
    } else {
      res.render('user/login', { loginErr });
    }
  },

  //logout
  logoutView: (req, res) => {
    req.session.destroy();
    res.redirect('/');
  },

  sessionchek: (req, res, next) => {
    if (req.session.loggedIn) {
      next();
    } else {
      res.redirect('/login');
    }
  },

  // loginSessionCheck: (req, res, next) => {
  //   if (req.session.user) {
  //     res.redirect("/home");
  //   } else {
  //     res.redirect("/");
  //   }
  // },

  // post request that handils register

  registerUser: async (req, res) => {
    try {
      User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
          regErr = 'user Exists';
          res.redirect('/login');
        } else {
          let { password } = req.body;
          const { confirm } = req.body;

          if (password !== confirm) {
            console.log('pasword must be same');
            regErr = 'pasword must be same'
          }
          req.session.userData = req.body;
          const phone = req.body.number;
          req.session.usernum = phone;
         

          sendsms(phone);

          res.render('user/VerifyOtp');
        }
      });
    } catch (err) {}
  },
  //PASPORT AUTHENTICATION
  // loginUser:async (req, res) => {
  //   const user =await User.findOne({email:req.body.email})
  //   passport.authenticate("local", {
  //     successRedirect: "/home",
  //     failureRedirect: "/",
  //     failureFlash: true,
  //   });
  //   if ((this.loginUser = true)) {

  //     req.session.user = user;
  //     res.locals.user=user || null

  //     res.render("user/home");
  //   } else {
  //     res.redirect("/");
  //   }
  //   req, res;
  // },
  loginUser: async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      if (user.access === true) {
        bcrypt.compare(req.body.password, user.password).then((data) => {
          if (data) {
            req.session.user = user;

            console.log('Login Success');

            req.session.loggedIn = true;
            res.locals.user = req.session.user || null;

            Product.find({})
              .limit(8)
              .then((result) => {
                let user = req.session.user;
                cartNum = req.session.cartNum;
              });
            res.redirect('/home');
          } else {
            console.log('Login Failed');
            loginErr = 'Invalid password';

            res.redirect('/login');
          }
        });
      } else {
        console.log('blocked user');
        loginErr = 'You have been restricted by the admin';
        res.redirect('/login');
      }
    } else {
      console.log('Login failed');
      loginErr = 'Invalid email';
      res.redirect('/login');
    }
  },

  verifyOtp: async (req, res) => {
    const { name, email, location, number } = req.session.userData;
    let { password } = req.session.userData;
    console.log(req.session.userData);
    const user = User.findOne({ email: email });
    const salt =await bcrypt.genSalt(10);
    password =await bcrypt.hash(password, salt);

    const num = req.session.usernum 

    const otp = req.body.OTP;

   
    await veryfyotp(num, otp).then((verification_check) => {
      if (verification_check.status == 'approved') {
        console.log('veryficaton sucess');

        const newUser = User.create({
          name,
          email,
          number,
          location,
          password,
        });

        req.session.userreg = req.body;

        res.render('user/login');
        
      } else {
        let err = 'OTP not match';
        res.render('user/VerifyOtp');
      }
    });
  },

  //viewing cart
  cartView: async (req, res) => {
    if (req.session.loggedIn) {
      let user = req.session.user;
      const userId = req.session.user._id;
      const cartView = await ShopingCart.findOne({ userId: userId })
        .populate('products.productId')
        .exec();
      if (cartView) {
        req.session.cartNum = cartView.products.length;
      }
      cartNum = req.session.cartNum;
      res.render('user/cart', { user, cartNum, cartProducts: cartView });
    } else {
      res.redirect('/login');
    }
  },

  //add to cart
  addToCart: async (req, res) => {
    try {
      let User = req.session.user;
      let quantity = 1;

      const productId = req.params.proId;

      const findProduct = await Product.findById(productId);

      const price = findProduct.price;
      const name = findProduct.name;
      const userId = req.session.user._id;
      let cart = await ShopingCart.findOne({ userId });
      if (cart) {
        let itemIndex = cart.products.findIndex(
          (p) => p.productId == productId
        );

        if (itemIndex > -1) {
          let productItem = cart.products[itemIndex];
          productItem.quantity += quantity;
        } else {
          cart.products.push({ productId, quantity, name, price });
        }

        cart.total = cart.products.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);
        await cart.save();
        res.redirect('/cart');
      } else {
        const total = quantity * price;
        cart = new ShopingCart({
          userId: userId,
          Product: [{ productId, quantity, name, price }],
          total: total,
        });
        await cart.save();
        res.redirect('/cart');
      }
    } catch (error) {
      res.status(429).render('admin/error-429');
    }
  },

  QuantityDec: async (req, res) => {
    let userCart = await ShopingCart.findOne({ userId: req.session.user._id });
    let ProductIndex = userCart.products.findIndex(
      (Product) => Product._id == req.params.proid
    );

    let arr = [...userCart.products];

    let productItem = arr[ProductIndex];
    userCart.total = userCart.total - productItem.price * productItem.quantity;
    productItem.quantity = productItem.quantity - 1;
    arr[ProductIndex] = productItem;
    userCart.total = userCart.total + productItem.price * productItem.quantity;

    userCart.save();
    res.json({ status: true });
  },

  QuantityInc: async (req, res) => {
    let userCart = await ShopingCart.findOne({ userId: req.session.user._id });
    let productIndex = userCart.products.findIndex(
      (product) => product._id == req.params.proid
    );

    let productItem = userCart.products[productIndex];
    userCart.total = userCart.total - productItem.price * productItem.quantity;
    productItem.quantity = productItem.quantity + 1;
    userCart.products[productIndex] = productItem;
    userCart.total = userCart.total + productItem.price * productItem.quantity;

    userCart.save();
    res.json({ status: true });
  },

  productDetails: async (req, res) => {
    if (req.session.loggedIn) {
      let proId = req.params.id;

      let result = await Product.find({ _id: proId });

      user = req.session.user;
      cartNum = req.session.cartNum;

      res.render('user/productDetails', { result, user, cartNum });
    } else {
      res.redirect('/login');
    }
  },

  removeCart: async (req, res) => {
    if (req.session.loggedIn) {
      let userCart = await ShopingCart.findOne({
        userId: req.session.user._id,
      });
      let productIndex = await userCart.products.findIndex(
        (product) => product._id == req.params.id
      );

      let productItem = userCart.products[productIndex];
      if (productItem != null) {
        userCart.total =
          userCart.total - productItem.price * productItem.quantity;
        userCart.products.splice(productIndex, 1);
        await userCart.save();
        res.redirect('/cart');
      } else {
        res.redirect('/home');
      }
    } else {
      res.redirect('/login');
    }
  },

  getCheckOut: async (req, res) => {
    try {
      if (req.session.user) {
        let user = req.session.user;
        let addresses = await Address.find({
          userId: req.session.user._id,
        });
        ShopingCart.find({ userId: req.session.user._id })
          .populate('products.productId')
          .exec()
          .then((result) => {
            cartNum = req.session.cartNum;
            res.render('user/checkOut', {
              user,
              cartNum,
              addresses,
              Cart: result[0],
            });
          });
      } else {
        res.redirect('/login');
      }
    } catch (err) {
      console.error(err);
      res.status(500);
    }
  },

  postCheckOut: async (req, res) => {
    try {
      let user = req.session.user;
      let userId = user._id;
      let address = await Address.findById(req.body.Address);

      let Cart = await ShopingCart.findById(req.params.CartId);
      let proId = Cart.products;
      console.log(proId);
      if (req.body.paymentMethod === 'Cash On Delivery') {
        const paymentMethod = req.body.paymentMethod;

        const newOrder = new OrderSchema({
          userId: userId,
          products: Cart.products,
          quantity: Cart.quantity,
          total: Cart.total,
          address,
          paymentMethod,
          paymentStatus: 'Payment Pending',
          orderStatus: 'orderconfirmed',
          track: 'orderconfirmed',
        });
        newOrder.save().then((result) => {
          
          req.session.orderId = result._id;
          Product.updateOne(
            {
              _id: proId,
            },
            {
              $inc: {
                quantity: -1,
              },
            }
          ).then((res) => {
            console.log(res);
          });

          ShopingCart.findOneAndRemove({ userId: result.userId }).then(
            (result) => {
              res.json({ cashOnDelivery: true });
            }
          );
        });
      } else if (req.body.paymentMethod === 'Online Payment') {
        const userId = Cart.userId;
        const products = Cart.products;
        const total = Cart.total;
        const paymentMethod = req.body.paymentMethod;
        let address = await Address.findById(req.body.Address);
        const track = 'orderconfirmed';
        const paymentStatus = 'Payment Completed';
        const orderStatus = 'orderconfirmed';
        const newOrder = new OrderSchema({
          userId,
          products,
          total,
          address,
          paymentMethod,
          paymentStatus,
          orderStatus,
          track,
        });
        newOrder.save().then((result) => {
          let userOrderData = result;
          req.session.orderId = result._id;
        
          id = result._id.toString();
          instance.orders.create(
            {
              amount: result.total * 100,
              currency: 'INR',
              receipt: id,
            },
            (err, order) => {
              console.log(err);
              let response = {
                onlinePayment: true,
                razorpayOrderData: order,
                userOrderData: userOrderData,
              };
              res.json(response);
            }
          );
          ShopingCart.findOneAndRemove({ userId: result.userId }).then(
            (result) => {}
          );
        });
      }
    } catch (error) {
      console.log(error);
      res.status(429);
    }
  },

  getConfirm: (req, res) => {
    if (req.session.user) {
      let user = req.session.user;
      let cartNum = req.session.cartNum;
     
      res.render('user/confirmation', {
        user,
        cartNum,
        orderId: req.session.orderId,
      });
    } else {
      res.redirect('/login');
    }
  },

  postverifyPayment: async (req, res) => {
    let razorpayOrderDataId = req.body['payment[razorpay_order_id]'];

    let paymentId = req.body['payment[razorpay_payment_id]'];

    let paymentSignature = req.body['payment[razorpay_signature]'];

    let userOrderDataId = req.body['userOrderData[_id]'];

    validate = validatePaymentVerification(
      { order_id: razorpayOrderDataId, payment_id: paymentId },
      paymentSignature,
      'zvcqB1phsfyXySVAZoHzObDB'
    );

    if (validate) {
      let order = await OrderSchema.findById(userOrderDataId);
      orderStatus = 'Order Placed';
      paymentStatus = 'Payment Completed';
      order.save().then((result) => {
        res.json({ status: true });
      });
    }
  },

  postPaymentFailed: (req, res) => {
    res.json({ status: true });
  },

  postOderSuccess: async (req, res) => {
    try {
      let user = req.session.user;
      req.session.orderId = req.query.id;
      let result = await OrderSchema.findById(req.query.id)
        .populate('address')
        .populate('products');
      // result.products.map(result.products)
      let address = Address.findById(req.query.id);

      res.render('user/orderSummary', {
        id: result,
        address,
        session: req.session,
        user,
      });
    } catch (error) {
      res.status(429).render('admin/error-429');
    }
  },

  getMyOrders: async (req, res) => {
    if (req.session.loggedIn) {
      try {
        let user = req.session.user;
        let result = await OrderSchema.find({ Cart: req.session.user.id }).sort(
          { date: -1 }
        );
        res.render('user/myOrders', {
          user,
          session: req.session,
          Orders: result,
        });
      } catch (err) {
        res.use((req, res) => {
          res.status(429).render('admin/error-429');
        });
      }
    } else {
      res.redirect('/login');
    }
  },

  getCancelOrder: async (req, res) => {
    if (req.session.loggedIn) {
      try {
        let orderId = req.query.id;

        let order = await OrderSchema.findByIdAndUpdate(orderId, {
          orderStatus: 'Cancellede',
          track: 'Cancellede',
        });
      } catch (error) {
        res.use((req, res) => {
          res.status(429).render('admin/error-429');
        });
      }
    }
  },

  returnOrder: async (req, res) => {
    try {
      oid = mongoose.Types.ObjectId(req.body.oid.trim());
      value = req.body.value;

      

      await OrderSchema.findByIdAndUpdate(oid, {
        track: 'Returnd',
        orderStatus: 'Returnd',
        returnreason: value,
      }).then((response) => {
        res.json({ status: true });
      });
    } catch (error) {
      res.status(429).render('admin/error-429');
    }
  },

  getShop: (req, res) => {
    try {
      let user = req.session.user;
      Product.find({ Delete: false }).then((result) => {
        Category.find().then((categories) => {
          res.render('user/Shop', {
            Products: result,
            Categories: categories,
            user,
          });
        });
      });
    } catch (err) {
      res.status(429).render('admin/error-429');
    }
  },

  getCategoryFilter: (req, res) => {
    try {
      let tags = req.query.tags;
      let filterkey = tags.split(',');
      console.log(filterkey);
      Product.aggregate([
        {
          $match: {
            status: false,
            category: { $in: filterkey },
          },
        },
      ]).then((result) => {
        let response = {
          Products: result,
        };
        res.json(response);
      });
    } catch (error) {
      res.status(429).render('admin/error-429');
    }
  },
  getAllCategory: (req, res) => {
    try {
      Product.find({ status: false }).then((result) => {
        res.json(result);
      });
    } catch (err) {
      res.status(429).render('admin/error-429');
    }
  },

  verifyCoupon: async (req, res) => {
    try {
      let couponcode = req.body.CouponCode;
      let total = req.body.total;
      let grandtotal;
      let couponMsg;

      let result = await CouponSchema.find({
        CODE: couponcode,
        status: 'ACTIVE',
      });
      console.log(result);
      if (result.length == 0) {
        couponMsg = 'Coupon Invalid';
        res.json({ status: false, couponMsg });
      } else {
        let couponType = result[0].couponType;
        let cutOff = parseInt(result[0].cutOff);
        let maxRedeemAmount = parseInt(result[0].maxRedeemAmount);
        let minCartAmount = parseInt(result[0].minCartAmount);
        let generateCount = parseInt(result[0].generateCount);
        if (generateCount != 0) {
          if (couponType == 'Amount') {
            if (total < minCartAmount) {
              couponMsg =
                'Minimum Rs.' + minCartAmount + ' need to Apply this Coupon';
              res.json({ status: false, couponMsg });
            } else {
              grandtotal = Math.round(total - cutOff);
              let response = {
                status: true,
                grandtotal: grandtotal,
                couponMsg,
                CutOff: cutOff,
              };
              res.json(response);
            }
          } else if ((couponType = 'Percentage')) {
            if (total < minCartAmount) {
              couponMsg =
                'Minimum Rs.' + minCartAmount + ' need to Apply this Coupon';
              res.json({ status: false, couponMsg });
            } else {
              let reduceAmount = Math.round((total * cutOff) / 100);
              if (reduceAmount > maxRedeemAmount) {
                grandtotal = Math.round(total - maxRedeemAmount);
                let response = {
                  status: true,
                  grandtotal: grandtotal,
                  couponMsg,
                  CutOff: maxRedeemAmount,
                };
                res.json(response);
              } else {
                grandtotal = Math.round(total - reduceAmount);
                let response = {
                  status: true,
                  grandtotal: grandtotal,
                  couponMsg,
                  CutOff: reduceAmount,
                };
                res.json(response);
              }
            }
          }
        } else {
          couponMsg = 'Coupon limit Exceeded';
          res.json({ status: false, couponMsg });
        }
      }
    } catch (error) {
      res.status(429).render('admin/error-429');
    }
  },

  checkStock: async (req, res) => {
    try {
      let cart = await ShopingCart.find({ userId: req.session.user._id });
      let result = { results: [] };
      let productStatus = [];
      for (i = 0; i < cart[0].products.length; i++) {
        let product = await Product.findById(cart[0].products[i].productId);
        let proId = cart[0].products[i].productId;
        if (product.quantity == 0) {
          productStatus.push('out of stock');
          let output = product.name + ' is out of stock';
          result.results.push(output);
        } else if (product.quantity < cart[0].products[i].quantity) {
          let output =
            'Only ' + product.quantity + ' stocks left of ' + product.name;
          result.results.push(output);
          productStatus.push(product.quantity + ' stock left');
        } else {
          productStatus.push('instock');
        }
      }
      const isInstockAll = (productStatus) => productStatus == 'instock';
      if (productStatus.every(isInstockAll)) {
        res.json({ state: true });
      } else {
        res.json({ result });
      }
    } catch (err) {
      res.status(429).render('admin/error-429');
    }
  },

  getForgot:(req,res)=>{
    res.render("user/forgotpass",{errMsg})
  },

  postForgot:(req,res)=>{
    let num = req.body.number

    
   let user =User.findOne({number:num})
   if(user){
    req.session.passnum = num
    sendsms(num);
    res.render('user/passchangeOTP')
   }else{
    errMsg="Number not registerd"
    res.redirect('/changepass')
   }

    
  },

  verifypassOtp:async(req,res)=>{
   let number = req.session.passnum
   let otp = req.body.OTP

   await veryfyotp(number, otp).then((verification_check)=>{
    if (verification_check.status == 'approved') {
      console.log("mothalalii janja jaga jaga");
      res.render('user/passresubmission')
    }else{
      errMsg = "OTP enterd is wrong"
      res.redirect('/changepass')
    }
    

   })
  },

  postPasschange:async(req,res)=>{
    console.log(req.body);
    let {confirmpass,email}=req.body
    console.log(email);
    let password = req.body.password
    
    console.log(password);

    if(password = confirmpass ){
      console.log("vanninn");
      const salt =await bcrypt.genSalt(10);
    password =await bcrypt.hash(password, salt);
       await User.updateOne({email:email},
        {
          $set:{
            password:password
          }
        }
        )
       res.redirect('/login')
    }
  }
  
};
