const JoiSchema = require('../models/joiSchema')

exports.validateRegister = (req, res, next) => {
  const result = JoiSchema.registerSchema.validate(req.body);
  if (result.error) {
    console.log(result.error.details);
    return res.render("user/register", {
      message: result.error.details[0].message,
    });
  } else {
    next();
  }
};

exports.validateLogin = (req,res,next) =>{
  const result = JoiSchema.loginSchema.validate(req.body);
  if(result.error){
    console.log(result.error.details);
    return res.render("user/login",{
      message: result.error.details[0].message,
    });
  }else{
    next();
  }
};

exports.validateAdmin = (req,res,next) => {
  const result = JoiSchema.adminSchema.validate(req.body )
  if(result.error){
    console.log(result.error.details);
    return res.render("admin/login",{
      message: result.error.details[0].message
    });
  }else{
    next();
  }
};