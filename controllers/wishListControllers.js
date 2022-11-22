const WishlistSchema = require("../models/wishListModel")



module.exports={
    
    getWishlist:(req,res)=>{
     
        if(req.session.loggedIn){
                console.log(req.session.user._id);
            WishlistSchema.findOne({userId:req.session.user._id}).then(
                (result)=>{
                    if(result.Products.length == 0){
                        res.render("user/favoraites",{session: req.session,wishlist:false})
                    }else{
                        res.render("user/favoraites",{session: req.session, Wishlist: result.Products})
                    }
                })

        }else{

            res.redirect('/login')

        }

    },

    getAddToWishlist: async (req, res) => {
        try {
            // console.log(req.session.user.id);
          let userWishlist = await WishlistSchema.findOne({
            
            userId: req.session.user._id,
          });
          if (userWishlist) {
            let ProductIndex = userWishlist.Products.findIndex(
              (Product) => Product.ProductId == req.query.productId
            );
    
            if (ProductIndex == -1) {
              userWishlist.Products.push({
                ProductId: req.query.productId,
                Price: req.query.price,
                Images: req.query.images,
                ProductName: req.query.productName,
              });
              userWishlist.save();
            }
            res.redirect('/wishlist')
          } else {
            const newWishlist = new WishlistSchema({
              userId: req.session.user._id,
              Products: {
                ProductId: req.query.productId,
                Price: req.query.price,
                Images: req.query.images,
                ProductName: req.query.productName,
              },
            });
            newWishlist.save().then((result) => {});
            res.redirect('/wishlist')
          }
        } catch (err) {
          console.log(err);
        }
      },


}

