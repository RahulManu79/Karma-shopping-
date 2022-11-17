const mongoose = require ('mongoose')

const cartSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Poduct'
            },
            quantity: Number,
            name: String,
            price: Number,
        }
    ],
    total: {
        type: Number,
    }


})

const ShoppingCart = mongoose.model("ShopingCart",cartSchema)

module.exports = ShoppingCart