var express = require('express');
var router = express.Router()
var cD = require('../cookieDivider');

router.get('/', function(req, res, next) {
	res.cookie('username','', {path: '/'});
	res.redirect('/')
})

module.exports = router;