const mongoose = require("mongoose")
const joi = require("joi")
const { boolean } = require("joi")

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password: {
        type:String,
        required:true,
    },
    location: {
        type:String,
        required:true
    },
    access: {
        type:Boolean,
        default: true,
        required:true
    },

    address: [
        {
            firstName: String,
            lastName: String,
            number: Number,
            homeaddress: String,
            city: String,
            district: String,
            country: String,
            zipcode: Number
        }
    ],
    wishlist:{
        type:Array
    }
    
   
})




const User = mongoose.model("User",UserSchema)



module.exports= User