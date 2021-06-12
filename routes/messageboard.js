var express = require('express');
var router = express.Router();
var app = require("../app.js");
var user_controller = require('../controllers/userController');
var message_controller = require('../controllers/messageController');
var passport = require("passport");




router.get('/sign-up', user_controller.sign_up_get);

router.post('/sign-up', user_controller.sign_up_post);

router.get('/log-in', user_controller.log_in_get);

router.post('/log-in', passport.authenticate("local"), user_controller.log_in_post);

router.get('log-out', user_controller.log_out);

router.get('/', message_controller.index_default);

router.get('/:username', message_controller.index);

router.get('/new-message', message_controller.create_message_post);

router.post('/new-message', message_controller.create_message_post);

module.exports = router;