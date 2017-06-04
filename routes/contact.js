var express = require('express');
var app = express();
var router = express.Router()

router.get('/', function(req, res, next) {
	var pageTitle = req.app.locals.websiteName + ' | Contact Me';
	res.render('contact', {title: pageTitle})
})

router.post('/', function(req, res, next) {
	console.log(req.body)
	res.redirect('/thanks')
})

module.exports = router;

