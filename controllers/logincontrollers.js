const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");

let loginErr=null

module.exports = {
  registerView: (req, res) => {
    if (req.session.user) {
      res.redirect("/home");
    } else {
      res.render("user/register");
    }
  },

  ///for view
  View: (req, res) => {
    res.render("user/home");
  },

  homeView: (req, res) => {
    res.render("user/home", {});
  },

  createView: (req, res) => {
    res.redirect("/register");
  },

  loginbtnView: (req, res) => {
    res.render("user/login",{loginErr});
  },

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

  loginSessionCheck: (req, res, next) => {
    if (req.session.user) {
      res.redirect("/home");
    } else {
      res.redirect("/");
    }
  },

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
          console.log(data);
          if (data) {
            console.log("Login Success");
            req.session.user = user;
            req.session.loggedIn = true;
            res.locals.user=user || null
            res.render('user/home')
          }else{
            console.log('Login Failed');
            loginErr = "Invalid password";
            console.log(req.session.userlogErr)
            res.redirect("/login");
          }
        });
      }else{
        console.log('blocked user');
        loginErr = "You have been restricted by the admin";
        res.redirect('/login');
      }
    }else{
      console.log('Login failed');
      loginErr = "Invalid email";
      res.redirect('/login');
    }
  },
};
