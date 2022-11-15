//js
const express = require('express');
var session = require('express-session')
const morgan = require('morgan')
const app = express();
const path = require('path');
const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/users');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
const {loginCheck,adminLoginCheck} = require("./routes/auth/passport");
loginCheck(passport);
adminLoginCheck(passport);

// Mongo DB conncetion
const database = 'mongodb+srv://rahul:XurmaxRBZM6txlS7@cluster0.jc0gl55.mongodb.net/Karma?retryWrites=true&w=majority';
mongoose.connect(database, {useUnifiedTopology: true, useNewUrlParser: true })
.then(() => console.log('e don connect'))
.catch(err => console.log(err));

//user static files
app.use(express.static(path.join(__dirname,'public')));
app.use('/css',express.static(__dirname+'/public/user/css'))
app.use('/img',express.static(__dirname+'/public/user/img'))
app.use('/js', express.static(__dirname+'/public/user/js'))
app.use('/fonts', express.static(__dirname+'/public/user/fonts'))
app.use('/scss',express.static(__dirname+'/public/user/scss'))

// Admin static files 
app.use('/css',express.static(__dirname+'/public/admin/css'))
app.use('/img',express.static(__dirname+'/public/admin/img'))
app.use('/js', express.static(__dirname+'/public/admin/js'))
app.use('/fonts', express.static(__dirname+'/public/admin/fonts'))
app.use('/scss',express.static(__dirname+'/public/admin/scss'))
app.use('/docs',express.static(__dirname+'/public/admin/docs'))
app.use('/vendors',express.static(__dirname+'/public/admin/vendors'))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(morgan('dev'))
app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge:6000000000 }
  }))

//body parsing
app.use(express.urlencoded({extended: false}))

app.use(passport.initialize())
app.use(passport.session())
//Routes
app.use(express.urlencoded({extended:false}))



app.use('/',usersRouter );
app.use('/admin',adminRouter)

app.use((req,res,next)=>{
  res.status(404).render('admin/error-404')
})

const PORT = process.env.PORT || 4111;
app.listen(PORT, console.log("Server has started at port " + PORT))