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
var env = require('dotenv').config();

const mongoDb = process.env.DB_NAME;


mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true});
var db = mongoose.connection;

db.on("error", console.error.bind(console, "mongo connection error"));

var User = user;

var app = express();



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


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


app.use(boardRouter);


let port = 3000;
let host = "localhost";

app.listen(port, host, () => console.log("app listening on "+ host + ":" + port));


module.exports = app;









