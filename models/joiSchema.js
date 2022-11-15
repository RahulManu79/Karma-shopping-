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