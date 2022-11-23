const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const Product = require("../models/productModel");

module.exports = {
  getWishlist: async (req, res) => {
    let user = req.session.user;
    let userDetails = await User.findOne({
      _id: mongoose.Types.ObjectId(user._id),
    });

    if (userDetails.wishlist == null) {
      res.render("user/wishlist", { user, products: false });
    } else {
      
      let products = [];
      for (let i = 0; i < userDetails.wishlist.length; i++) {
        let product = await Product.findOne({ _id: userDetails.wishlist[i] });
        products.push(product)
      }
      res.render("user/wishlist", { user, products });
    }
  },

  getAddToWishlist: async (req, res) => {
   
    let proId = req.query.id;
    let userId = mongoose.Types.ObjectId(req.session.user._id);
    const prodExist = await User.findOne({
      _id: userId,
      wishlist: mongoose.Types.ObjectId(proId),
    });
    if (prodExist == null) {
      await User.updateOne(
        { _id: mongoose.Types.ObjectId(req.session.user._id) },
        {
          $push: { wishlist: mongoose.Types.ObjectId(proId) },
        }
      ).then((result) => {
       
      });
      res.redirect("/");
    } else {
      await User.updateOne(
        { _id: mongoose.Types.ObjectId(req.session.user._id) },
        {
          $pull: { wishlist: mongoose.Types.ObjectId(proId) },
        }
      );
    }
  },

  removeFromWishlist:async(req,res)=>{
    let USER = await User.findOne({
      userId: req.session._id
    })

    let prorductIndex = await USER.wishlist.findIndex(
      (product)=> product._id == req.query.id
    )

    let ProductIndex = USER.wishlist[prorductIndex]
     if(prorductIndex != null){
      USER.wishlist.splice(ProductIndex,1);
      USER.save();
      res.redirect("/wishlist")
     }else{
      res.redirect('/login')
     }
  }
};
