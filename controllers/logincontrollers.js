const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const ShopingCart = require("../models/cartModel");
const Product = require("../models/productModel");

let loginErr = null;

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
      
      Product.find({}).limit(8).then((result) => {
        let user = req.session.user;
        cartNum = req.session.cartNum
        // const ashan = result;
      
        res.render("user/home", { result  });
      })
    }
  },

  //register view
  createView: (req, res) => {
    res.redirect("/register");
  },

  //showing user profile
  userprofile: (req, res) => {
    if (req.session.loggedIn) {
      let user = req.session.user;
      cartNum = req.session.cartNum;
      res.render("user/userProfile", { user, cartNum });
    } else {
      res.redirect("/");
    }
  },

  //logged in home view
  login: async (req, res) => {
    if (req.session.loggedIn) {
      const userId = req.session.user._id
      const viewcart = await ShopingCart.findOne({userId:userId}).populate('products.productId').exec()
      if (viewcart){
        req.session.cartNum = viewcart.products.length
      }

      Product.find({}).limit(8).then((result) => {
        let user = req.session.user;
        cartNum = req.session.cartNum
        // ashan = result;
   
        res.render("user/home", { user, result , cartNum });
      })
      .catch((err) => {
        console.log(err);
      })
     
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
    if (req.session.user) {
      next();
    } else {
      res.redirect("/");
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

            Product.find({}).limit(8).then((result) => {
              let user = req.session.user;
              cartNum = req.session.cartNum
              // ashan = result;
            
              res.render("user/home", { user, result , cartNum });
            })
          } else {
            console.log("Login Failed");
            loginErr = "Invalid password";
            console.log(req.session.userlogErr);
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
      const cartView = await ShopingCart.findOne({ userId: userId }).populate('products.productId').exec()
      if (cartView) {
        req.session.cartNum = cartView.products.length
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
      const price = findProduct.price
      const name = findProduct.name
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
    let userCart = await ShopingCart.findOne({ userId: req.session.user._id })
        let ProductIndex = userCart.products.findIndex(Product => Product._id == req.params.proid);
console.log(ProductIndex);
        let arr =[...userCart.products]
        console.log(arr);
        let productItem = arr[ProductIndex];
        userCart.total = userCart.total - (productItem.price * productItem.quantity)
        productItem.quantity = productItem.quantity - 1;
        arr[ProductIndex] = productItem;
        userCart.total = userCart.total + (productItem.price * productItem.quantity)

        userCart.save();
        res.json({ status: true })
  },

  QuantityInc: async (req, res) => {
    let userCart = await ShopingCart.findOne({ userId: req.session.user._id });
    let productIndex = userCart.products.findIndex((product) => product._id == req.params.proid);

    let productItem = userCart.products[productIndex];
    userCart.total = userCart.total - productItem.price * productItem.quantity;
    productItem.quantity = productItem.quantity + 1;
    userCart.products[productIndex] = productItem;
    userCart.total = userCart.total + productItem.price * productItem.quantity;

    userCart.save();
    res.json({ status: true });
  },

  productDetails:async (req,res) =>{
    if(req.session.loggedIn){

      let proId = req.params.id
      
     let result = await Product.find({_id : proId})
          
     Users = req.session.user
     cartNum = req.session.cartNum
  
     res.render('user/productDetails',{result,Users,cartNum})
     
    }else{
      res.redirect('/login')
    }


  },

  removeCart: async (req,res)=>{
if(req.session.loggedIn){

  let userCart = await ShopingCart.findOne({ userId: req.session.user._id });
  let productIndex = userCart.products.findIndex((product) => product._id == req.params.id);

  let productItem = userCart.products[productIndex];
  userCart.total = userCart.total - (productItem.price * productItem.quantity)
  userCart.products.splice(productIndex,1)
  userCart.save();
  res.redirect('/cart')


}else{
  res.redirect('/login');
}

  },

  getCheckOut : (req,res)=>{
    if(req.session.user){
      user = req.session.user
      ShopingCart.find({ userId: req.session.user._id }).populate('products.productId').exec().then((result) => {
        cartNum = req.session.cartNum
        res.render('user/checkout', { user, cartNum, session: req.session, Cart: result[0] })
      })
    }else{
      res.redirect('/login')
    }
  },

  getFavoraites:(req,res)=>{
    if(req.session.loggedIn){
      res.render('user/favoraites')
    }else{
      res.redirect('/login')
    }
  }


};
