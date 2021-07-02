var User = require('../models/user');
var Message = require('../models/message');
const { body,validationResult } = require('express-validator');
var async = require('async');

exports.index_default = function(req, res, next) {
    Message.find({}, 'user title date script')
    .populate('user')
    .exec(function(err, list_messages) {
        if(err) { return next(err);}
        res.render('index', {title: 'Members Only Message Board', message_list: list_messages});
    });
};

exports.index = function(req, res, next) {
    Message.find({}, 'title date script')
    .populate('user')
    .exec(function(err, list_messages) {
        if(err) { return next(err);}
            res.render('index', {title: 'Members Only Message Board', message_list: list_messages, user: req.user});
    });
};


exports.create_message_get = function(req,res,next) {
    res.render('new-message', {title: 'New Message', title_label: 'Title'});
};


exports.create_message_post = [

    body('title', 'title must not be empty').trim().isLength({min:1}).escape(),
    body('script', 'script must not be empty').trim().isLength({min:1}).escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        let date = new Date();

        let dateString = date.toDateString();

        var message = new Message ({
            user: req.user,
            title: req.body.title,
            date: dateString, 
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

            res.redirect('/' + req.user.username);
        }); 
    }
    }
    
]

exports.message_delete_get = function(req,res,next) {

    async.parallel({
        message: function(callback) {
            Message.findById(req.params.messageid).exec(callback)
        },
        message_user: function(callback) {
            User.find({'message': req.params.messageid}).exec(callback)
        },
    }, function(err, results) {
        if(err) {
            return next(err);
        } 
            res.render('delete', {title: "Delete this Message?", message: results.message, message_user: results.message_user});
                
            });
    };


exports.message_delete_post = function(req,res,next) { 

    async.parallel({
        message: function(callback) {
            Message.findById(req.body.messageid).exec(callback)
        },
        message_user: function(callback) {
            User.find({'user': req.body.messageid}).exec(callback)
        },
    }, function(err, results) {
        if(err) {
            return next(err);
        } 

        else {
            Message.findByIdAndRemove(req.body.messageid, function deleteMessage(err) {
                if(err) {
                    return next(err);
                }
                    res.redirect('/' + req.user.username);   
            })
        }
    })
}


exports.edit_message_get = function(req,res,next) {
    Message.findById(req.params.messageid).exec(function(err, message) {
        if(err) { return next(err);} 
        res.render('new-message', {title: 'New Message', title_label: 'Title', message: message});
    })
   
};


exports.edit_message_post= [

     body('title', 'title must not be empty').trim().isLength({min:1}).escape(),
     body('script', 'script must not be empty').trim().isLength({min:1}).escape(),

     (req, res, next) => {

        const errors = validationResult(req);

        
            if(!errors.isEmpty()) {
                User.find({}, 'name')
                .exec(function(err, results) {
                    if(err) { return next(err);}
    
                    res.render('new-message', {title: "edit this message", user: results.user, message: message, errors: errors.array()});
                });
                return;
            }
            else {
                var message = new Message(
                    {
                        user: req.user, //
                        title: req.body.title,
                        script: req.body.script,
                        _id: req.params.messageid
                    });
            Message.findByIdAndUpdate(req.params.messageid, message, { new: true }, function(err, newmessage) {
                if(err) { return next(err); } 
                
                res.redirect('/' + req.user.username + "/");
            }); 
        }
    }
]



