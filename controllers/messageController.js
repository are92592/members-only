var User = require('../models/user');
var Message = require('../models/message');
const { body,validationResult } = require('express-validator');
var async = require('async');
//var currentUser = app.useCurrentUser;


exports.index_default = function(req, res, next) {
    Message.find({}, 'user title script')
    .populate('user')
    .exec(function(err, list_messages) {
        if(err) { return next(err);}
        //LocalStrategy.res.locals.currentUser = req.user;
        //next();
        res.render('index', {title: 'Members Only Message Board', message_list: list_messages});
    });
};

exports.index = function(req, res, next) {
    Message.find({}, 'title script')
    .populate('user')
    .exec(function(err, list_messages) {
        if(err) { return next(err);}
        //LocalStrategy.res.locals.currentUser = req.user;
        //next();
        res.render('index', {title: 'Members Only Message Board', message_list: list_messages, user: req.user});
    });
};
//date_and_time user    //remember to put this back into the second .find parameter at some point 
//, user: req.user.username  res.locals.currentUser

//show message input page //get
exports.create_message_get = function(req,res,next) {
    res.render('new-message', {title: 'New Message', title_label: 'Title'});
};
/*
//
exports.create_message_get = function(req,res,next) {
    User.find({}, 'username')
    .exec(function(err, user) {
        if(err) { return next(err);}
        res.render('new-message', {title: 'New Message', title_label: 'Title', user: user});
    })
    
};*/

//create new message //post
exports.create_message_post = [

   /* body('user', 'user must not be empty').trim().isLength({min:1}).escape(),*/
    body('title', 'title must not be empty').trim().isLength({min:1}).escape(),
    body('script', 'script must not be empty').trim().isLength({min:1}).escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        var message = new Message ({
            //date_and_time: new Date(), 
            user: req.user,
            title: req.body.title,
            script: req.body.script
        });

        ///for preliminary testing purposes, comment this out until user creation exists
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

            res.redirect('/messageboard/' + req.user.username);
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
        /*if(results.message_user) 
            {res.render('delete', {title: "Delete this Message?", message: results.message, message_user: results.message_user});
            return;
        }*/
        else {
            Message.findByIdAndRemove(req.body.messageid, function deleteMessage(err) {
                if(err) {
                    return next(err);
                }
                    res.redirect('/messageboard/' + req.user.username);
                
            })
        }
    })
}




/* 

try using a version of the below function but without the async parallel nor with the user included

*/
exports.edit_message_get = function(req,res,next) {
    res.render('new-message', {title: 'New Message', title_label: 'Title'});
};

/*
exports.edit_message_get = function(req,res,next) {
            Message.findById(req.params.id).exec(function(err, message) {
            if(err) {return next(err);}
            res.render('new-message',{title: 'Edit this Message', title_label: 'Title', script: "What's now on your mind?", message: message});
        })
};*/

/*
//edit message page //get
exports.edit_message_get = function(req,res,next) {
    async.parallel({
        message:function(callback) {
            Message.findById(req.params.id).populate('user').exec(callback)
        },
        user: function(callback) {
            User.find(callback)
        },
        }, function(err, results) {
            if(err) {return next(err);}
            if(results.message ==null) {
                var err = new Error('No User');
                err.status = 404;
                return next(err);
            } 
            res.render('new-message',{title: 'Edit this Message', title_label: 'Title', script: "What's now on your mind?", user: results.message.user._id.username, message:results.message});
        })
}
*/

exports.edit_message_post= [

    //body('user', 'user must not be empty').trim().isLength({min:1}).escape(),
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
                        //date_and_time: new Date(), 
                        user: req.user, //
                        title: req.body.title,
                        script: req.body.script,
                        _id: req.params.messageid
                    });
            Message.findByIdAndUpdate(req.params.messageid, message, { new: true }, function(err, newmessage) {
                if(err) { return next(err); } 
                
                res.redirect('/messageboard/' + req.user.username + "/");
            }); 
        }
    }
]



   //}, newmessage
       

       /*if(!errors.isEmpty()) {
            User.find({}, 'name')
            .exec(function(err, results) {
                if(err) { return next(err);}

                res.render('new-message', {title: 'New Message', user: results.user, message: message, errors: errors.array()});
            });
            return;
        }
        else {*/
   

//edit message //post
//exports.edit_message_post('')

//delete messsage 
