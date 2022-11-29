const Admin = require("../models/admin");
const Poduct = require("../models/productModel");
const User = require("../models/user")
const Category = require("../models/categoryModel")
const bcrypt = require("bcryptjs");
const passport = require("passport");
const Product = require("../models/productModel");
const Order = require("../models/oderModel")
const Address =require("../models/addressModel");
const BannerSchema = require("../models/bannerMOdel")
const { response } = require("express");
const { override } = require("joi");

let errMsg

let errorMsg

module.exports = {

  adminSessionCheck:(req,res,next)=>{
    if(req.session.adminloggedIn){
      next()
    }else{
      res.redirect('/admin/')
    }
  },
  loginView: (req, res) => {
    if (req.session.adminloggedIn) {
      res.redirect("/admin/dashbord");
    } else {
      res.render("admin/login");
    }
  },

  dashbordView: (req, res) => {
      res.render("admin/index");
   
  },

  productList: async(req, res) => {
    if (req.session.adminloggedIn) {

      const result = await Poduct.find({})
  
        console.log(result);
    
          res.locals.result = result ;
          res.render("admin/products", { result });
    } else {
      res.redirect("/admin/");
    }
  },

  accontView: (req, res) => {
    if (req.session.adminloggedIn) {
      res.render("admin/accounts");
    } else {
      res.redirect("/admin/");
    }
  },

  addProductView: (req, res) => {
    if (req.session.adminloggedIn) {
      Category.find({}, function(err,result){
        if (err){
          res.send(err)
        } else {
          res.render("admin/add-product", {result});
        }
      })
    
    } else {
      res.redirect("/admin/");
    }
  },

  adminLogout: (req, res) => {
    req.session.destroy();
    res.redirect("/admin/");
  },

  // adminLoginCheck: async (req, res) => {
  //   const admin = await Admin.findOne({ email: req.body.email });
  //   passport.authenticate("local", {
  //     successRedirect: "/dashbord",
  //     failureRedirect: "/admin",
  //     failureFlash: true,
  //   });
  //   if ((this.adminLoginCheck = true)) {
  //     req.session.admin = admin;
  //     res.locals.admin = admin || null;

  //     res.render("admin/index");
  //   } else {
  //     res.render("admin/login");
  //   }
  //   req, res;
  // },

  adminLogin: async (req, res) => {
    const admin = await Admin.findOne({ email: req.body.email });

    if (admin) {
      const data = await bcrypt.compare(req.body.password, admin.password);
      if (data) {
        console.log("admin login Sucess");
        req.session.admin = admin;
        req.session.adminloggedIn = true;
        res.redirect("/admin/dashbord");
      } else {
        console.log("login failed");
        res.redirect("/admin/");
      }
    } else {
      console.log("login Failed");
      res.redirect("/admin/");
    }
  },

  postaddProducts:(req, res, next) => {
    const image = [];

    for(file of req.files){
      image.push(file.filename);
    }
    const {name,brand,quantity,category,price,description}=req.body;
    const status =false;

    const product = new Product({
      name,
      brand,
      quantity,
      category,
      price,
      description,
      image,
      status
    })
    product.save()
    res.redirect('/admin/product')
  },
  
  deletproduct : (req,res)=>{
    try {
      
      let proId = req.params.id
  
      Product.deleteOne({_id:proId}).then(()=>{
        res.json({status: true})
      })
    } catch (error) {

      res.json({status: false})
      
    }
  },

  postEditProduct:async(req,res)=>{
    let proId = req.query.id
    console.log(proId);
    console.log(req.body,"body here")


    await Product.findByIdAndUpdate(proId,{
      name: req.body.name,
      brand: req.body.brand,
      quantity: req.body.quantity,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image
    }).then((result)=>{
     
      res.redirect('/admin/product')
    }).catch((err)=>{
      console.log(err);
      
    })
    
  },

  getEditProducr: (req,res) =>{
      let proId = req.query.id
      Product.find({_id:proId},function(err,data){
        if(err){
          res.send(err)
        }else{
          let result = data[0]

          res.render("admin/editProduct",{result});
        }
      })

  },

  userList: (req,res) =>{
      User.find({},function(err,result){

        if(err){
          res.send(err)
        }else{
          res.render('admin/accounts',{result})
        }

      })
  },

  blockUser: async(req,res) =>{
    let userId = req.params.id;
    await User.updateOne({_id:userId},{
      $set: {
        access: false
      }
    })
    res.redirect('/admin/account')
  },

  unblockUser: async(req,res) =>{
    let userId = req.params.id
    await User.updateOne({_id:userId},{
      $set: {
        access:true
      }
    })
    res.redirect('/admin/account')
  },

  getCategory:(req,res)=>{
      Category.find({}, function (err, result){
        if (err){
         
          res.send(err)
        } else {
          res.render('admin/categorylist',{result,errMsg,errorMsg})
        }
        errMsg = null
      })
    errorMsg = null
  },

  postadmincategory: (req,res)=>{
         req.body.category =req.body.category.toLowerCase();
         Category.findOne({category: req.body.category}).then((itexists)=>{

          if(itexists){
            errMsg = "This category already exists"
            res.redirect("/admin/adminCategory")
          }else {
            const {category} = req.body;
            const status = true;

            const addcategory =new Category({
              category,
              status
            })
            addcategory.save()
            res.redirect('/admin/adminCategory')
          }
         })
  },

  deletCatagory: (req,res) =>{
    let proId = req.params.category

    Product.find({category:proId}).then((result)=>{

      if (result.length == 0) {
        Category.deleteOne({category:proId}).then(()=>{
          res.json({status:true})
        })
      } else {
        res.json({status:false})
      }
    })
  },

  getCateProduct: (req,res)=>{
   try{
      Product.find({category:req.params.category},function(err, result){
        if(err){
          res.send(err)

        }else {
         res.render('admin/catagorizedProducts',{result})
        }
      })
   } catch (error) {
    next(error)
   }
  },

  getOrderlist:async(req,res)=>{
    try {
     let result = await Order.find({}).sort({Date:-1})
    Object.values(result)
     res.render('admin/orders',{result})
    } catch (error) {
      console.log(error);  
    }
  },

  changeTrack:async(req,res)=>{

    try {
      oid= req.body.oid
      value= req.body.value
      
      await Order.findByIdAndUpdate(oid,{track:value,orderStatus:value}).then((response)=>{})
    } catch (error) {

      console.log(error);
      
    }
  },

  getBanner:async(req,res)=>{
    try {
      const result = await BannerSchema.find()
      res.render('admin/banner',{result})
    } catch (err) {
      res.send(err)
    }
  },

  getAddBanner:(req,res)=>{
    res.render("admin/addBanner")
  },

  postAddBanner:(req,res)=>{


    console.log(req.file,"/////////////")
    console.log(req.body)
    try {

      
      const Banner = new BannerSchema({
        Title: req.body.Title,
        Description: req.body.Description,
        Image:req.file.filename,
        route:req.body.route
      });
      Banner.save().then((result)=>{})
      res.redirect('/admin/banners')

    } catch (error) {
      res.send(error)
      console.log(error);
    }
  },

  deletBanner:(req,res)=>{
    try {
      proId=req.params.id
   
      BannerSchema.findByIdAndDelete({_id:proId}).then(()=>{
           res.json({status:true})
      })
      
    } catch (error) {
      res.json({status:false})
    }


  },



};
