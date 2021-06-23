var createError = require('http-errors');
var express = require('express');
const session = require("express-session");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var boardRouter = require('./routes/messageboard');
const user = require('./models/user');
const flash = require('express-flash'); ////

var Message = require('./models/message');

const mongoDb = 'mongodb+srv://erhartica:Edmunds5@cluster0.neybr.mongodb.net/local_library?retryWrites=true&w=majority';

///finalize the visual layout
///change how errors are displayed
///figure out what's really needed in the controller functions
///figure out why appostrophies are going thru as hexidecimals


//const mongoDb = 'mongodb+srv://erhartica:Edmunds5@cluster0.neybr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true});
var db = mongoose.connection;

db.on("error", console.error.bind(console, "mongo connection error"));

var User = user;

//const currentUser = req.user;

var app = express();
/*app.set('views', __dirname);
app.set("view engine", "ejs");*/

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(flash());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//process.env file
app.use(session({secret: "cats", resave: false, saveUninitialized: true}));

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if(err) {
        return done(err);
      };
      if(!user) {
        return done(null, false, { message: "Incorrect username"});
     }
     bcrypt.compare(password, user.password, (err, res) => {
       if(res) {
         return done(null, user)
       } else {
         return done(null, false, { message: "Incorrect password"})
       }
       })
     });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


//////
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));


app.use('/messageboard', boardRouter);


let port = 3000;
let host = "localhost";

app.listen(port, host, () => console.log("app listening on "+ host + ":" + port));


module.exports = app;










/* start going thru passport creation and mongodb syncing, comment out other code if need be to test on browser*/

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/