var createError = require('http-errors');
var express = require('express');
const session = require("express-session");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const user = require('./models/user');

const mongoDb = 'mongodb+srv://erhartica:Edmunds5@cluster0.neybr.mongodb.net/local_library?retryWrites=true&w=majority';
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "mongo connection error"));

/*const User = mongoose.model(
  "User",
  new Schema({
    username: {type: String, required: true},
    password: { type: String, required: true}
  })
);*/

const User = user;

const app = express();
/*app.set('views', __dirname);
app.set("view engine", "ejs");*/

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use('/', user);

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

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));



app.use(function(req,res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req,res) => {
  res.render("index", { user: req.user });
});

app.get("/sign-up", (req, res) => 
  res.render("sign-up"));


app.post("/sign-up", (req,res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      membership_status: "silver",
    }).save(err => {
      if(err) {
        return next(err);
      };
      res.redirect("/");
    });
  });
});
//var app = express();

app.get("/log-in", (req, res) => {
  res.render("log-in");
});

// view engine setup
app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect:"/",
    failureRedirect: "/"
  })
);

app.get("/log-out", (req,res) => {
  req.logout();
  res.redirect("/");
});


let port = 3000;
let host = "localhost";

app.listen(port, host, () => console.log("app listening on "+ host + ":" + port));

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

module.exports = app;
