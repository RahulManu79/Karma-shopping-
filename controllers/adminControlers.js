const Admin = require('../models/admin');
const Poduct = require('../models/productModel');
const User = require('../models/user');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const Order = require('../models/oderModel');
const Address = require('../models/addressModel');
const BannerSchema = require('../models/bannerMOdel');
const CouponSchema = require('../models/CouponModel');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { count } = require('../models/admin');

let errMsg;

let errorMsg;

module.exports = {
  adminSessionCheck: (req, res, next) => {
    if (req.session.adminloggedIn) {
      next();
    } else {
      res.redirect('/admin/');
    }
  },
  loginView: (req, res) => {
    if (req.session.adminloggedIn) {
      res.redirect('/admin/dashbord');
    } else {
      res.render('admin/login');
    }
  },

  dashbordView: async (req, res) => {
    try {
      let orderCount = 0;
      let userCount = 0;
      let totalEarnings = 0;
      let shippedCount = 0;
      let deliveredCount = 0;
      let pendingCount = 0;
      let ordercanceledcount = 0;

      let orders = await Order.find();
      let user = await User.find();

      orderCount = orders.length;
      userCount = user.length;

      await Order.aggregate([
        {
          $match: {
            paymentStatus: 'Payment Completed',
          },
        },
        {
          $group: {
            _id: null,
            Amount: { $sum: '$total' },
          },
        },
      ]).then((result) => {
        if (result.length != 0) {
          totalEarnings = result[0].Amount;
        }
      });
      await Order.aggregate([
        {
          $match:{
            orderStatus:'Cancellede'
          }
        },
        {
          $count:'Count'
        }
      ]).then((result)=>{
        if(result.length != 0){
          ordercanceledcount = result[0].Count
        }
      })
      await Order.aggregate([
        {
          $match: {
            orderStatus: 'Shipped',
          },
        },
        {
          $count: 'Count',
        },
      ]).then((result) => {
        if (result.length != 0) {
          shippedCount = result[0].Count;
        }
      });
      await Order.aggregate([
        {
          $match: {
            orderStatus: 'Delivered',
          },
        },
        {
          $count: 'Count',
        },
      ]).then((result) => {
        if (result.length != 0) {
          deliveredCount = result[0].Count;
        }
      });
      await Order.aggregate([
        {
          $match: {
            orderStatus: 'orderconfirmed',
          },
        },
        {
          $count: 'Count',
        },
      ]).then((result) => {
        if (result.length != 0) {
          pendingCount = result[0].Count;
        }
      });

      let graphOrderCompleteData = await Order.aggregate([
        {
          $project: {
            Date: { $dateToString: { format: '%d-%m-%Y', date: '$updatedAt' } },
            OrderStatus: '$orderStatus',
          },
        },
        {
          $match: {
            OrderStatus: 'Delivered',
          },
        },
        {
          $group: {
            _id: '$Date',
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
        { $limit: 7 },
      ]);
    

      let graphOrdercancelledData = await Order.aggregate([
        {
          $project: {
            Date: { $dateToString: { format: '%d-%m-%Y', date: '$createdAt' } },
            OrderStatus: '$orderStatus',
          },
        },
        {
          $match: {
            OrderStatus: 'Cancellede',
          },
        },
        {
          $group: {
            _id: '$Date',
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
        { $limit: 7 },
      ])
     
      var DateSpan = [];
      for (let i = 0; i < 7; i++) {
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - i);
        var $dd = currentDate.getDate();
        var $mm = currentDate.getMonth() + 1; //January is 0!
        var $yyyy = currentDate.getFullYear();
        if ($dd < 10) {
          $dd = "0" + $dd;
        }
        if ($mm < 10) {
          $mm = "0" + $mm;
        }
        currentDate = $dd + "-" + $mm + "-" + $yyyy;
        DateSpan.push(currentDate);
      }
    
      let finalOrderCompletdata = [];
      for (let i = 0; i < graphOrderCompleteData.length; i++) {
        for(let j =0 ; j< DateSpan.length; j++){
          if (graphOrderCompleteData[i] != undefined) {
            if (DateSpan[j] == graphOrderCompleteData[i]._id) {
              finalOrderCompletdata.push(graphOrderCompleteData[i].count);
              i++;
            } else {
              finalOrderCompletdata.push(0);
            }
          } else {
            finalOrderCompletdata.push(0);
          }
      }
    }

      let finalOrdercanceldata = [];
      
      for (i = 0; i < graphOrdercancelledData.length; i++) {
        for (j = 0; j < DateSpan.length; j++) {
          if (graphOrdercancelledData[i] != undefined) {
            if (DateSpan[j] == graphOrdercancelledData[i]._id) {
              finalOrdercanceldata.push(graphOrdercancelledData[i].count);
              i++;
            } else {
              finalOrdercanceldata.push(0);
            }
          } else {
            finalOrdercanceldata.push(0);
          }
        }
      }
      let ordersList = await Order.find().sort({ Date: -1 }).limit(10);
      let totalcancelorder = finalOrdercanceldata.length
      
      res.render('admin/index',{
        orderCount,
        ordercanceledcount,
        userCount,
        totalEarnings,
        pendingCount,
        shippedCount,
        deliveredCount,
        DateSpan,
        finalOrderCompletdata,
        totalcancelorder,
        ordersList,
      });
    
  } catch (error) {
    app.use((req,res)=>{
      res.status(429).render('admin/error-429')
    })
    }
  }
  ,

  productList: async (req, res) => {
    if (req.session.adminloggedIn) {
      const result = await Poduct.find({});
      res.locals.result = result;
      res.render('admin/products', { result });
    } else {
      res.redirect('/admin/');
    }
  },

  accontView: (req, res) => {
    if (req.session.adminloggedIn) {
      res.render('admin/accounts');
    } else {
      res.redirect('/admin/');
    }
  },

  addProductView: (req, res) => {
    if (req.session.adminloggedIn) {
      Category.find({}, function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.render('admin/add-product', { result });
        }
      });
    } else {
      res.redirect('/admin/');
    }
  },

  adminLogout: (req, res) => {
    req.session.destroy();
    res.redirect('/admin/');
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
        console.log('admin login Sucess');
        req.session.admin = admin;
        req.session.adminloggedIn = true;
        res.redirect('/admin/dashbord');
      } else {
        console.log('login failed');
        res.redirect('/admin/');
      }
    } else {
      console.log('login Failed');
      res.redirect('/admin/');
    }
  },

  postaddProducts: (req, res, next) => {
    const image = [];

    for (file of req.files) {
      image.push(file.filename);
    }
    const { name, brand, quantity, category, price, description } = req.body;
    const status = false;

    const product = new Product({
      name,
      brand,
      quantity,
      category,
      price,
      description,
      image,
      status,
    });
    product.save();
    res.redirect('/admin/product');
  },

  deletproduct: (req, res) => {
    try {
      let proId = req.params.id;

      Product.deleteOne({ _id: proId }).then(() => {
        res.json({ status: true });
      });
    } catch (error) {
      res.json({ status: false });
      app.use((req,res)=>{
        res.status(429).render('admin/error-429')
      })
    }
  },

  postEditProduct: async (req, res) => {
    let proId = req.query.id;
    console.log(proId);
    console.log(req.body, 'body here');

    await Product.findByIdAndUpdate(proId, {
      name: req.body.name,
      brand: req.body.brand,
      quantity: req.body.quantity,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
    })
      .then((result) => {
        res.redirect('/admin/product');
      })
      .catch((err) => {
        app.use((req,res)=>{
          res.status(429).render('admin/error-429')
        })     
       });
  },

  getEditProducr: (req, res) => {
    let proId = req.query.id;
    Product.find({ _id: proId }, function (err, data) {
      if (err) {
        res.send(err);
      } else {
        let result = data[0];

        res.render('admin/editProduct', { result });
      }
    });
  },

  userList: (req, res) => {
    User.find({}, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.render('admin/accounts', { result });
      }
    });
  },

  blockUser: async (req, res) => {
    let userId = req.params.id;
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          access: false,
        },
      }
    );
    res.redirect('/admin/account');
  },

  unblockUser: async (req, res) => {
    let userId = req.params.id;
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          access: true,
        },
      }
    );
    res.redirect('/admin/account');
  },

  getCategory: (req, res) => {
    Category.find({}, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.render('admin/categorylist', { result, errMsg, errorMsg });
      }
      errMsg = null;
    });
    errorMsg = null;
  },

  postadmincategory: (req, res) => {
    req.body.category = req.body.category.toLowerCase();
    Category.findOne({ category: req.body.category }).then((itexists) => {
      if (itexists) {
        errMsg = 'This category already exists';
        res.redirect('/admin/adminCategory');
      } else {
        const { category } = req.body;
        const status = true;

        const addcategory = new Category({
          category,
          status,
        });
        addcategory.save();
        res.redirect('/admin/adminCategory');
      }
    });
  },

  deletCatagory: (req, res) => {
    let proId = req.params.category;

    Product.find({ category: proId }).then((result) => {
      if (result.length == 0) {
        Category.deleteOne({ category: proId }).then(() => {
          res.json({ status: true });
        });
      } else {
        res.json({ status: false });
      }
    });
  },

  getCateProduct: (req, res) => {
    try {
      Product.find({ category: req.params.category }, function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.render('admin/catagorizedProducts', { result });
        }
      });
    } catch (error) {
      next(error);
      app.use((req,res)=>{
        res.status(429).render('admin/error-429')
      })
    }
  },

  getOrderlist: async (req, res) => {
    try {
      // let  page=req.query.page
      //  let limit=req.query.limit

      //  let startIndex = (page-1)*limit
      let result = await Order.find({}).sort({ Date: -1 });
      Object.values(result);
      res.render('admin/orders', { result });
    } catch (error) {
      app.use((req,res)=>{
        res.status(429).render('admin/error-429')
      })
    }
  },

  changeTrack: async (req, res) => {
    try {
      oid = req.body.oid;
      value = req.body.value;

      console.log(oid, value, 'lllll');

      if (value == 'Delivered') {
        await Order.updateOne(
          {
            _id: oid,
          },
          {
            $set: {
              track: value,
              orderStatus: value,
              paymentStatus: 'Payment Completed',
            },
          }
        ).then((res) => {
          console.log(res);
        });
      } else {
        await Order.updateOne(
          {
            _id: oid,
          },
          {
            $set: {
              track: value,
              orderStatus: value,
            },
          }
        ).then((res) => {
          console.log(res);
        });
      }
    } catch (error) {
      app.use((req,res)=>{
        res.status(429).render('admin/error-429')
      })
    }
  },

  getBanner: async (req, res) => {
    try {
      const result = await BannerSchema.find();
      res.render('admin/banner', { result });
    } catch (err) {
      app.use((req,res)=>{
        res.status(429).render('admin/error-429')
      })
    }
  },

  getAddBanner: (req, res) => {
    res.render('admin/addBanner');
  },

  postAddBanner: (req, res) => {
    try {
      const Banner = new BannerSchema({
        Title: req.body.Title,
        Description: req.body.Description,
        Image: req.file.filename,
        route: req.body.route,
      });
      Banner.save().then((result) => {});
      res.redirect('/admin/banners');
    } catch (error) {
      app.use((req,res)=>{
        res.status(429).render('admin/error-429')
      })
    }
  },

  deletBanner: (req, res) => {
    try {
      proId = req.params.id;

      BannerSchema.findByIdAndDelete({ _id: proId }).then(() => {
        res.json({ status: true });
      });
    } catch (error) {
      res.json({ status: false });
      app.use((req,res)=>{
        res.status(429).render('admin/error-429')
      })
    }
  },

  getCouponList: (req, res) => {
    try {
      CouponSchema.find().then((result) => {
        res.render('admin/coupon', { result });
      });
    } catch (error) {
      app.use((req,res)=>{
        res.status(429).render('admin/error-429')
      })
    }
  },

  getAddCoupon: (req, res) => {
    try {
      res.render('admin/add-coupon');
    } catch (error) {
      app.use((req,res)=>{
        res.status(429).render('admin/error-429')
      })
    }
  },

  postAddCoupon: async (req, res) => {
    try {
      let Code = req.body.Code;
      let CutOff = req.body.CutOff;
      let couponType = req.body.CouponType;
      let minCartAmount = req.body.minAmount;
      let maxRedeemAmount = req.body.maxAmount;
      let generateCount = req.body.generateCount;
      let expireDate = req.body.expireDate;
      Code = Code.toUpperCase();
      console.log(couponType);
      CouponSchema.find({ CODE: Code }).then((result) => {
        if (result.length == 0) {
          const Coupon = new CouponSchema({
            CODE: Code,
            cutOff: CutOff,
            couponType: couponType,
            minCartAmount: minCartAmount,
            maxRedeemAmount: maxRedeemAmount,
            generateCount: generateCount,
            expireDate: expireDate,
          });
          Coupon.save().then((result) => {
            res.redirect('/admin/couponList');
          });
        } else {
          couponExistErr = 'Coupon Already Exist';
          res.redirect('/admin/addcoupon');
        }
      });
    } catch (error) {
      app.use((req,res)=>{
        res.status(429).render('admin/error-429')
      })
    }
  },

  CouponActive: async (req, res) => {
    try {
      proId = req.query.id;
      console.log(proId);

      await CouponSchema.updateOne(
        { _id: proId },
        { $set: { status: 'ACTIVE' } }
      ).then((result) => {
        res.redirect('/admin/couponList');
      });
    } catch (error) {
      app.use((req,res)=>{
        res.status(429).render('admin/error-429')
      })
    }
  },

  blockCoupon: async (req, res) => {
    try {
      proId = req.query.id;
      console.log(proId);

      await CouponSchema.updateOne(
        { _id: proId },
        { $set: { status: 'BLOCK' } }
      ).then((result) => {
        res.redirect('/admin/couponList');
      });
    } catch (error) {
      app.use((req,res)=>{
        res.status(429).render('admin/error-429')
      })
    }
  },

  deleteCoupon: (req, res) => {
    try {
      proId = req.query.id;
      CouponSchema.findByIdAndDelete(proId).then((result) => {
        res.redirect('/admin/couponList');
      });
    } catch (error) {
      app.use((req,res)=>{
        res.status(429).render('admin/error-429')
      })
    }
  },

  getreport: async (req, res) => {
    try {
      await Order.aggregate([
        {
          $match: {
            paymentStatus: 'Payment Completed',
            orderStatus: 'Delivered',
          },
        },
        {
          $project: {
            date: { $dateToString: { format: '%d/%m/%Y', date: '$createdAt' } },
            paymentStatus: '$paymentStatus',
            paymentMethod: '$paymentMethod',
            address: '$address',
            total: '$total',
            orderStatus: '$orderStatus',
          },
        },
      ]).then((result) => {
        console.log(result, 'vuyfucukc7xr');
        res.render('admin/salesreport', { result });
      });
    } catch (error) {
      app.use((req,res)=>{
        res.status(429).render('admin/error-429')
      })
    }
  },
};
