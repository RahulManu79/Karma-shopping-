const { string } = require("joi");
const mongoose = require("mongoose");

const oderSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  products: {},
  total: {
    type: Number,
    required: true,
  },
  address: {
    firstName: String,
    lastName: String,
    number: Number,
    homeaddress: String,
    city: String,
    district: String,
    country: String,
    zipcode: Number,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
  },
  track:{
    type: String,
  },
  returnreason:{
    trpe:String,
  }

});

const OrderSchema = mongoose.model("oder", oderSchema);

module.exports = OrderSchema;
