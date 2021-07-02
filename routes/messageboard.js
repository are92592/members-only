var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');
var message_controller = require('../controllers/messageController');
var passport = require("passport");


router.get('/sign-up', user_controller.sign_up_get);

router.post('/sign-up', user_controller.sign_up_post);

router.get('/log-in', user_controller.log_in_get);

router.post('/log-in', passport.authenticate("local"), user_controller.log_in_post);

router.get('/log-out', user_controller.log_out);

router.get('/:username/edit-user', user_controller.edit_user_get);

router.post('/:username/edit-user', user_controller.edit_user_post);

router.get('/', message_controller.index_default);

router.get('/:username', message_controller.index);

router.get('/:username/new-message', message_controller.create_message_get);

router.post('/:username/new-message', message_controller.create_message_post);

router.get('/:username/:messageid', message_controller.index);

router.get('/:username/:messageid/edit-message', message_controller.edit_message_get);

router.post('/:username/:messageid/edit-message', message_controller.edit_message_post);

router.get('/:username/:messageid/delete', message_controller.message_delete_get);

router.post('/:username/:messageid/delete', message_controller.message_delete_post);


module.exports = router;