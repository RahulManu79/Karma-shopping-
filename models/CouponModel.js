const mongoose = require("mongoose")

const CouponSchema = mongoose.Schema({
    
    CODE : {
        type : String,
        required : true
    },
    cutOff: {
        type : Number,
        required : true
    },
    timeStamp :{
        type : Date,
        default : new Date()
    },
    status : {
        type : String,
        default : 'BLOCKED'
    },
    couponType:{
        type:String,
        required:true
    },
    maxRedeemAmount : {
        type : Number,
        required : true
    },
    minCartAmount : {
        type : Number,
        required : true
    },
    generateCount : {
        type : Number,
        required : true
    },
    expireDate : {
        type : Date,
        require : true
    }

})

const Coupon = mongoose.model("Coupon",CouponSchema)

module.exports= Coupon