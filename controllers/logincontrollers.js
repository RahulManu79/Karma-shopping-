const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const ShopingCart = require("../models/cartModel");
const Product = require("../models/productModel");
const OrderSchema = require("../models/oderModel");
const Address = require("../models/addressModel");
const Razorpay = require("razorpay");
var {
  validatePaymentVerification,
} = require("../node_modules/razorpay/dist/utils/razorpay-utils");
const { trusted } = require("mongoose");
let loginErr = null;

var instance = new Razorpay({
  key_secret: "zvcqB1phsfyXySVAZoHzObDB",
  key_id: "rzp_test_EsWfdOrXZua8KY",
});

module.exports = {
  registerView: (req, res) => {
    if (req.session.user) {
      res.redirect("/home");
    } else {
      res.render("user/register");
    }
  },

  //nouser home view
  homeView: (req, res) => {
    if (req.session.loggedIn) {
      res.redirect("/home");
    } else {
      Product.find({})
        .limit(8)
        .then((result) => {
          let user = req.session.user;
          cartNum = req.session.cartNum;
          // const ashan = result;

          res.render("user/home", { result });
        });
    }
  },

  //register view
  createView: (req, res) => {
    res.redirect("/register");
  },

  //showing user profile
  userprofile: (req, res) => {
      try {
        let user = req.session.user;
        Address
          .find({ userId: req.session.user._id })
          .then((result) => {
            res.render("user/userProfile", {user,
              session: req.session,
              addresses: result,
            });
          });
      } catch (err) {
        console.log(err);
      }
    
  },

  getEditAdress:(req,res)=>{
    try {
      let user = req.session.user;
      res.render("user/addAdress", {user ,session: req.session });
      
    } catch (error) {
      console.log(error);
    }
  },

  postEditAdress:async(req,res)=>{
   try {
    const address = await Address({
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      number:req.body.number,
      email:req.body.email,
      houseName:req.body.houseName,
      homeaddress:req.body.homeaddress,
      city:req.body.city,
      district:req.body.district,
      state:req.body.state,
      country:req.body.country,
      zipcode:req.body.zipcode,
      userId:req.session.user._id
    })
    address.save().then((result)=>{})
    res.redirect('/userProfile')
   } catch (error) {
    console.log(error);
   }

  },

  deleteAdress:async(req,res)=>{
   
    Address.deleteOne({_id : req.query.id}).then((response)=>{
      res.redirect('/userProfile')
    })
  },

  //logged in home view
  login: async (req, res) => {
    if (req.session.loggedIn) {
     
      const userId = req.session.user._id;
      const viewcart = await ShopingCart.findOne({ userId: userId })
        .populate("products.productId")
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

          res.render("user/home", { user, result, cartNum });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.redirect("/");
    }
  },

  //login page
  loginbtnView: (req, res) => {
    if (req.session.loggedIn) {
      res.redirect("/home");
    } else {
      res.render("user/login", { loginErr });
    }
  },

  //logout
  logoutView: (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },

  sessionchek: (req, res, next) => {
    if (req.session.loggedIn) {
      next();
    } else {
      res.redirect("/login");
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
    const { name, email, location, confirm } = req.body;
    let { password } = req.body;
    //comfirm passowrd
    if (password !== confirm) {
      console.log("pasword must be same");
    } else {
      const user = await User.findOne({ email: email });
      if (user) {
        console.log("email exists");
      } else {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        const newUser = await User.create({
          name,
          email,
          location,
          password,
        });

        res.render("user/login", {});
      }
    }
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
            console.log("Login Success");
            req.session.user = user;
            req.session.loggedIn = true;
            res.locals.user = user || null;

            Product.find({})
              .limit(8)
              .then((result) => {
                let user = req.session.user;
                cartNum = req.session.cartNum;
                // ashan = result;

                res.render("user/home", { user, result, cartNum });
              });
          } else {
            console.log("Login Failed");
            loginErr = "Invalid password";
            
            res.redirect("/login");
          }
        });
      } else {
        console.log("blocked user");
        loginErr = "You have been restricted by the admin";
        res.redirect("/login");
      }
    } else {
      console.log("Login failed");
      loginErr = "Invalid email";
      res.redirect("/login");
    }
  },

  //viewing cart
  cartView: async (req, res) => {
    if (req.session.loggedIn) {
      let user = req.session.user;
      const userId = req.session.user._id;
      const cartView = await ShopingCart.findOne({ userId: userId })
        .populate("products.productId")
        .exec();
      if (cartView) {
        req.session.cartNum = cartView.products.length;
      }
      cartNum = req.session.cartNum;
      res.render("user/cart", { user, cartNum, cartProducts: cartView });
    } else {
      res.redirect("/login");
    }
  },

  //add to cart
  addToCart: async (req, res) => {
    if (req.session.loggedIn) {
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
        res.redirect("/cart");
      } else {
        const total = quantity * price;
        cart = new ShopingCart({
          userId: userId,
          Product: [{ productId, quantity, name, price }],
          total: total,
        });
        await cart.save();
        res.redirect("/cart");
      }
    } else {
      res.redirect("/login");
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

      Users = req.session.user;
      cartNum = req.session.cartNum;

      res.render("user/productDetails", { result, Users, cartNum });
    } else {
      res.redirect("/login");
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
        userCart.save();
        res.redirect("/cart");
      } else {
        res.redirect("/home");
      }
    } else {
      res.redirect("/login");
    }
  },

  getCheckOut: async (req, res) => {
    if (req.session.user) {
     let user = req.session.user;
      let addresses = await Address.find({
        userId: req.session.user._id,
      })
      ShopingCart.find({ userId: req.session.user._id })
        .populate("products.productId")
        .exec()
        .then((result) => {
          cartNum = req.session.cartNum;
          res.render("user/checkout", {
            user,
            cartNum,
            addresses,
            session: req.session,
            Cart: result[0],
          });
        }); 
    } else {
      res.redirect("/login");
    }
  },

  postCheckOut: async (req, res) => {
    let user = req.session.user;
    let userId = user._id;
    let address = await Address.findById(req.body.Address)

    let Cart = await ShopingCart.findById(req.params.CartId);
    if (req.body.paymentMethod === "Cash On Delivery") {
  
    
      const paymentMethod = req.body.paymentMethod;
    
  

      const newOrder = new OrderSchema({
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        userId: userId,
        products: Cart.products,
        quantity: Cart.quantity,
        total: Cart.total,
        address,
        paymentMethod,
        paymentStatus: "Payment Pending",
        orderStatus: "Order Placed",
        track:"orderconfirmed"
      });
      newOrder.save().then((result) => {
        req.session.orderId = result._id;

        ShopingCart.findOneAndRemove({ userId: result.userId }).then(
          (result) => {
            res.json({ cashOnDelivery: true });
          }
        );
      });
    
    } else if (req.body.paymentMethod === "Online Payment") {
      const date = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString();
      const userId = Cart.userId;
      const products = Cart.products;
      const total = Cart.total;
      const paymentMethod = req.body.paymentMethod;
      let address = await Address.findById(req.body.Address)
        const track = "Shipped"
        const paymentStatus = "Payment Completed";
        const orderStatus = "Order Pending";
        const newOrder = new OrderSchema({
          date,
          time,
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
          
          id = result._id.toString();
          instance.orders.create(
            {
              amount: result.total * 100,
              currency: "INR",
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
  },

  getConfirm: (req, res) => {
    if (req.session.user) {
      let user = req.session.user;
      let cartNum = req.session.cartNum;
      res.render("user/confirmation", {
        user,
        cartNum,
        orderId: req.session.orderId,
      });
    } else {
      res.redirect("/login");
    }
  },

  postverifyPayment: async (req, res) => {
    let razorpayOrderDataId = req.body["payment[razorpay_order_id]"];

    let paymentId = req.body["payment[razorpay_payment_id]"];

    let paymentSignature = req.body["payment[razorpay_signature]"];

    let userOrderDataId = req.body["userOrderData[_id]"];

    validate = validatePaymentVerification(
      { order_id: razorpayOrderDataId, payment_id: paymentId },
      paymentSignature,
      "zvcqB1phsfyXySVAZoHzObDB"
    );
 
    if (validate) {
      
      let order = await OrderSchema.findById(userOrderDataId);
      orderStatus = "Order Placed";
      paymentStatus = "Payment Completed";
      order.save().then((result) => {
        res.json({ status: true });
      });
    }
  },

  postPaymentFailed: (req, res) => {
  
    res.json({ status: true });
  },

  postOderSuccess:async (req, res) => {
    
    let user = req.session.user;
    req.session.orderId = req.query.id;
    let result = await OrderSchema.findById(req.query.id).populate("address").populate("products")
    // result.products.map(result.products)
    let address= Address.findById(req.query.id)


    res.render("user/orderSummary", { id:result ,address,session:req.session,user});
  },

  getMyOrders:async(req,res)=>{
    if(req.session.loggedIn){
      try{
        let user = req.session.user;
       let result = await OrderSchema.find({Cart:req.session.user.id}).sort({date:-1})
        res.render('user/myOrders',{ user,session:req.session,Orders:result})
       
      }catch(err){
        console.log(err);
      }

    }else{
      res.redirect('/login')
    }
  },

  getCancelOrder:async(req,res)=>{
    if(req.session.loggedIn){
      try {
       let orderId=req.query.id;
       
        let order = await OrderSchema.findByIdAndUpdate(orderId,{orderStatus:"Cancellede", track:"Cancellede"});
        
      } catch (error) {
        console.log(error);
        
      }
    }
  }
};
