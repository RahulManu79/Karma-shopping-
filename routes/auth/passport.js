const bcrypt = require("bcryptjs");

LocalStrategy = require("passport-local").Strategy;


// Load module
const User = require("../../models/user");
const Admin = require('../../models/admin');


module.exports = {
  loginCheck: (passport) => {
    let user;
    passport.use(
      new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
          //check coustomer
          user = await User.findOne({ email });
          console.log(user);
          if (!user || !Object.keys(user).length) {
            console.log("wrong email");
            return done();
          }
          //match password
          bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error) throw error;
            if (isMatch) {
              return done(null, user);
            } else {
              console.log("wrong Password");
              return done();
            }
          });
        }
      )
    );

    passport.serializeUser((user, done) => {
      done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
      User.findById(id, (error, user) => {
        done(error, user);
      });
    });
  },


  adminLoginCheck : (passport) =>{
    let admin;
    passport.use(
      new LocalStrategy(
      {usernameField:"email"},
      async (email , password , done) => {
        admin = await  Admin.findOne({email})
        console.log(admin);
        if(!admin || !Object.keys(admin).length){
          console.log("wrong email")
          return done()
        }
       //match password
       bcrypt.compare(password , admin.password, (error,isMatch)=>{
        if(error) throw error;
        if(isMatch){
          return done(null , admin)
        }else{
          console.log("wrong password");
          return done();
        }
       })

      }
    ));
    
    passport.serializeUser((admin, done) => {
      done(null, admin.id);
    });
    passport.deserializeUser((id, done) => {
      Admin.findById(id, (error, admin) => {
        done(error, admin);
      });
    })
  }
};



