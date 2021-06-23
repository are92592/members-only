var User = require('../models/user');
var Message = require('../models/message');
var mongoose = require('mongoose');
const { body,validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
var passport = require("passport");


//show user signup page //get
exports.sign_up_get = function(req, res, next) {
    res.render("sign-up", {title: 'Sign Up', user: req.user});
}


//create new user //post
exports.sign_up_post = [ 

    (req,res,next) => {

        const errors = validationResult(req);



        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        const user = new User(
            {
                username: req.body.username,
                password: hashedPassword,
                membership_status: "silver",
            });

            if(user.username === "admin554") {
                user.membership_status = "gold";
            }

        user.save(function (err) {
            if(err || req.body.password !== req.body.passwordConfirm) {return next(err); }

            res.redirect('/messageboard/');
        })
    }); 

    }
];

exports.log_in_get = function(req,res,next) {
    res.render("log-in", { user: req.user });
}


exports.log_in_post = function(req,res,next) {
          res.redirect("/messageboard/" + req.user.username);
}

exports.log_out = function(req,res) {
    req.logout();
    res.redirect("/messageboard/");
  };


////////////

exports.edit_user_get = function(req, res) {
    res.render("edit-user", {title: "Upgrade status to platinum, and write and edit your posts"});
}

exports.edit_user_post = function(req,res) {
    if(req.body.password === "password12345") {
        var user = new User({
            name: req.user.name, ///
            password: req.user.password,
            membership_status: "platinum",
            _id : req.user.id,
        })
    }

    User.findByIdAndUpdate(req.user.id, user, { new: true },  function(err, updatedmember) {
        if(err) {
            return next(err);
        } else {
            res.redirect("/messageboard/" + req.params.username);
        }
    })
}



