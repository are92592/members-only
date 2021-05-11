var User = require('../models/user');
var Message = require('../models/message');
var mongoose = require('mongoose');
const { body,validationResult } = require('express-validator');



//show message input page //get
exports.create_message_get('/create-message', (req,res,next) => {
    res.render('new-message', {title: 'New Message', title_label: 'Title', script: "What's on your mind?"});
});

//create new message //post
exports.create_message_post('/create-message', (req,res,next) => {

    var message = new Message ({
        date_and_time: new Date(), //
        user: req.url.id.name,
        title: req.body.title_label,
        script: req.body.script
    });

    message.save(function (err) {
        if(err) {return next(err); }

        res.redirect('/');
    }); 
});

//edit message page //get
exports.edit_message_get('/edit-message', (req,res,next) => {
    res.render('new-message',{title: 'Edit this Message', title_label: 'Title', script: "What's now on your mind?"});
})

//edit message //post
exports.edit_message_post('')

//delete messsage 