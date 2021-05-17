var User = require('../models/user');
var Message = require('../models/message');
var mongoose = require('mongoose');
const { body,validationResult } = require('express-validator');


exports.index = function(req, res, next) {
    Message.find({}, 'date_and_time user title script')
    .populate('user')
    .exec(function(err, list_messages) {
        if(err) { return next(err);}
        res.render('index', {title: 'Members Only Message Board', message_list: list_messages});
    });
};

//show message input page //get
exports.create_message_get = function(req,res,next) {
    res.render('new-message', {title: 'New Message', title_label: 'Title'});
};

//create new message //post
exports.create_message_post= [

    body('user', 'user must not be empty').trim().isLength({min:1}).escape(),
    body('title', 'title must not be empty').trim().isLength({min:1}).escape(),
    body('script', 'script must not be empty').trim().isLength({min:1}).escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        var message = new Message ({
            //date_and_time: new Date(), 
            user: req.body.name,
            title: req.body.title_label,
            script: req.body.script
        });

        if(!errors.isEmpty()) {
            User.find({}, 'name')
            .exec(function(err, results) {
                if(err) { return next(err);}

                res.render('new-message', {title: 'New Message', user: results.user, message: message, errors: errors.array()});
            });
            return;
        }
        else {
        message.save(function (err) {
            if(err) {return next(err); }

            res.redirect('/');
        }); 
    }
    }
    
]

//edit message page //get
exports.edit_message_get = function(req,res,next) {
    async.parallel({
        message:function(callback) {
            Message.findById(req.params.id).populate('category').exec(callback)
        },
        user: function(callback) {
            User.find(callback)
        },
        }, function(err, results) {
            if(err) {return next(err);}
            if(results.mesage ==null) {
                var err = new Error('No Category');
                err.status = 404;
                return next(err);
            }
            res.render('new-message',{title: 'Edit this Message', title_label: 'Title', script: "What's now on your mind?"});
        })
}

exports.edit_message_post= [

    body('user', 'user must not be empty').trim().isLength({min:1}).escape(),
    body('title', 'title must not be empty').trim().isLength({min:1}).escape(),
    body('script', 'script must not be empty').trim().isLength({min:1}).escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        var message = new Message(
            {
                //date_and_time: new Date(), 
                user: req.body.name,
                title: req.body.title_label,
                script: req.body.script
            });

        if(!errors.isEmpty()) {
            User.find({}, 'name')
            .exec(function(err, results) {
                if(err) { return next(err);}

                res.render('new-message', {title: 'New Message', user: results.user, message: message, errors: errors.array()});
            });
            return;
        }
        else {
        message.save(function (err) {
            if(err) {return next(err); }

            res.redirect('/');
        }); 
    }
    }
    
]
   

//edit message //post
//exports.edit_message_post('')

//delete messsage 