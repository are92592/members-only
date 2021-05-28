var express = require('express');
var router = express.Router();
var app = require("../app.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', user: app.user });
});

module.exports = router;
