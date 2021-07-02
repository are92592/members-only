var User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");

exports.sign_up_get = function(req, res, next) {
    res.render("sign-up", {title: 'Sign Up', user: req.user});
}


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

            if(user.username === process.env.ADMIN_NAME) {
                user.membership_status = "gold";
            }

        user.save(function (err) {
            if(err || req.body.password !== req.body.passwordConfirm) {return next(err); }

            res.redirect('/');
        })
    }); 

    }
];

exports.log_in_get = function(req,res,next) {
    res.render("log-in", { user: req.user });
}


exports.log_in_post = function(req,res,next) {
          res.redirect("/" + req.user.username);
}

exports.log_out = function(req,res) {
    req.logout();
    res.redirect("/");
  };


exports.edit_user_get = function(req, res) {
    res.render("edit-user", {title: "Upgrade status to platinum, and write and edit your posts"});
}

exports.edit_user_post = function(req,res) {
    if(req.body.password === "password12345") {
        var user = new User({
            name: req.user.name, 
            password: req.user.password,
            membership_status: "platinum",
            _id : req.user.id,
        })
    }

    User.findByIdAndUpdate(req.user.id, user, { new: true },  function(err, updatedmember) {
        if(err) {
            return next(err);
        } else {
            res.redirect("/" + req.params.username);
        }
    })
}



