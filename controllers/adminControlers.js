const Admin = require("../models/admin");
const Poduct = require("../models/productModel");
const User = require("../models/user")
const Category = require("../models/categoryModel")
const bcrypt = require("bcryptjs");
const passport = require("passport");
const Product = require("../models/productModel");

let errMsg

let errorMsg

module.exports = {
  loginView: (req, res) => {
    if (req.session.adminloggedIn) {
      res.redirect("/admin/dashbord");
    } else {
      res.render("admin/login");
    }
  },

  dashbordView: (req, res) => {
    if (req.session.adminloggedIn) {
      res.render("admin/index");
    } else {
      res.redirect("/admim/");
    }
  },

  productList: async(req, res) => {
    if (req.session.adminloggedIn) {

      const result = await Poduct.find({})
  
        console.log(result);
    
          res.locals.result = result ;
          res.render("admin/products", { result });
    } else {
      res.redirect("/admim/");
    }
  },

  accontView: (req, res) => {
    if (req.session.adminloggedIn) {
      res.render("admin/accounts");
    } else {
      res.redirect("/admim/");
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
      res.redirect("/admim/");
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
    const status =true;

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
    let proId = req.params.id

    Product.deleteOne({_id:proId}).then(()=>{
      res.json({status: true})
    })
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
    if(req.session.adminloggedIn){
      let proId = req.query.id
    
      Product.find({_id:proId},function(err,data){
        if(err){
          res.send(err)
        }else{
          let result = data[0]

          res.render("admin/editProduct",{result});
        }
      })

    }else{
    
      res.redirect('/admin/')
    }
  },

  userList: (req,res) =>{
    if(req.session.adminloggedIn){

      User.find({},function(err,result){

        if(err){
          res.send(err)
        }else{
          res.render('admin/accounts',{result})
        }

      })
      
    }else{
      res.redirect('/admin/')
    }
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
    if(req.session.adminloggedIn){
      Category.find({}, function (err, result){
        if (err){
          console.log("................");
          res.send(err)
        } else {
          res.render('admin/categorylist',{result,errMsg,errorMsg})
        }
        errMsg = null
      })
    }else {
      res.redirect('/admin/')
    }
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
    if (req.session.adminloggedIn){
      Product.find({category:req.params.category},function(err, result){
        if(err){
          res.send(err)

        }else {
         res.render('admin/catagorizedProducts',{result})
        }
      })
    } else {
      res.redirect('/admin/')
    }
   } catch (error) {
    next(error)
   }
  }
};
