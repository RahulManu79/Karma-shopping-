const Joi = require("joi");
const joi = require("joi");

exports.registerSchema = joi
  .object({
    name: joi.string().trim().min(2).max(64).required(),

    email: joi
      .string()
      .trim()
      .lowercase()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } }),

      number: joi.number().required(),

    location: joi.string().required(),

    password: joi.string().required(),

    confirm: joi.ref("password"),
  })
  .with("password", "confirm");


  exports.loginSchema = Joi.object({
    email: joi
    .string()
    .trim()
    .lowercase()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } }),

    password: joi.string().required(),

  })

  exports.adminSchema = Joi.object({
    

    email: Joi
      .string()
      .trim()
      .lowercase()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } }),

      password: Joi.string().required(),  
  })


  exports.productSchema = Joi.object({
    
    name: Joi.string().required(),

    brand: Joi.string().required(),

    quantity: Joi.number().required(),

    category: Joi.string().required(),

    price: Joi.number().required(),

    description: Joi.string().required(),

    image: Joi.array().required(),

    status: Joi.boolean().required(),

  })

  exports.Address = Joi.object({
    firstName:  Joi.string().alphanum().min(3).max(25).trim(true).required(),

    lastName: Joi.string().alphanum().max(25).trim(true).required(),

    number : Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    
    email: Joi.string()
    .trim()
    .lowercase()
    .email(),
    
    houseName: Joi.string().min(3).required(),

    homeaddress: Joi.string().min(8).required(),

    city : Joi.string().min(4).max(25).required(),

    district: Joi.string().min(3).max(20).required(),

    state:Joi.string().min(3).max(20).required(),

    country: Joi.string().min(1).max(28).required(),

    zipcode: Joi.string().min(4).max(9).required(),
     
    userId: Joi.allow(),
  

  })