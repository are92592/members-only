var express = require('express');
var router = express.Router();
var app = require("../app.js");
var user_controller = require('../controllers/userController');


router.get('/sign-up', user_controller.sign_up_get);

router.post('/sign-up', user_controller.sign_up_post);

module.exports = router;