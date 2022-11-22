const mongoose = require("mongoose");

const Schema = mongoose.Schema

const productSchema = new Schema({
    ProductId : {
        type : String,
        required : true
    },
    ProductName : {
        type : String,
        required : true
    },
    Price : {
        type : Number,
        required : true
    },
    Images : {
        type : Array,
        required : true
    }

})

const WishlistSchema = new Schema({
    userId : {
        type : String,
        required : true
    },
    Products : [productSchema]
})

const Wishlist = mongoose.model("Wishlist",WishlistSchema)

module.exports = Wishlist;