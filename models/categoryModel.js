const mongoose = require('mongoose');


const categoryShema = new mongoose.Schema({


    category: {
        type:String,
        required:true,
        unique: true,
    },
    status:{
        type: Boolean,
        required:true,
    }
})

const Category = mongoose.model("Category",categoryShema)

module.exports=Category