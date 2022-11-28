const { required, string } = require("joi");
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  houseName: {
    type: String,
    required: true,
  },
  homeaddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  state:{
    type:String,
    required:true
  },
  country: {
    type: String,
    required: true,
  },
  zipcode: {
    type: Number,
    required: true,
  },

  userId: {
    type: mongoose.Schema.Types.String,
    ref: "users",
    required: true,
  },
  address: {
    type: mongoose.Schema.Types.String,
    ref: "addresses",
    
  },
});

const Address = mongoose.model("address", addressSchema);

module.exports = Address;
