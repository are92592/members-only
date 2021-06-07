var User = require('../models/user');
//var Message = require('../models/message');
var mongoose = require('mongoose');
const { body,validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");


//show user signup page //get
exports.sign_up_get = function(req, res, next) {
    res.render("sign-up", {title: 'Sign Up'})
}


//create new user //post
exports.sign_up_post =[ 

    (req,res,next) => {

        const errors = validationResult(req);

       /* if(!errors.isEmpty()) {
            res.render('sign-up-form', {title: 'Sign Up'});
            return;
        } else {

        }*/

        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        const user = new User(
            {
                /*first_name: req.body.first_name,
                last_name: req.body.last_name,*/
                username: req.body.username,
                password: hashedPassword,
                membership_status: "silver",
            });
        user.save(function (err) {
            if(err) {return next(err); }

            res.redirect('/');
        })
    });   
    }
];

////log-in stuff




/*
//change user status input //get
exports.become_an_admin('/become-an-admin', (req,res,next) => {
    res.render('become-an-admin', {title: 'Become an Admin!'})

    
})

//change user status //post
exports.become_an_admin('/become-an-admin', (req,res,next) => {
    if(!error) {
        req.user.id.membership_status = "gold";
    }
})

*/
