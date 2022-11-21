const mongoose = require('mongoose');


const oderSchema = new mongoose.Schema({


    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    products: {},
    total: {
        type: Number,
        required: true
    },
    address: {},
    paymentStatus: {
        type: String,
        required: true
    },
    orderStatus: {
        type: String,
        required: true
    }
})

const OrderSchema = mongoose.model("oder",oderSchema)

module.exports = OrderSchema