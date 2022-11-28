const mongoose = require("mongoose")

const BannerSchema = mongoose.Schema({

    Title : {
        type : String,
        required : true
    },
    Description : {
        type : String,
        required : true
    },
    Image :{
        type : String,
        required : true
    },
    route:{
        type: String
    }

    
})

const Banner = mongoose.model("Banner",BannerSchema)

module.exports= Banner