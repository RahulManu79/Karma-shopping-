const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: Array,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
})

const Product = mongoose.model("Poduct",productSchema)

module.exports = Product