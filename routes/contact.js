var express = require('express');
var app = express();
var router = express.Router()
var mySQL = require('../my_sql_setup.js')

router.get('/', function(req, res, next) {
	var pageTitle = req.app.locals.websiteName + ' | Contact Me';
	res.render('contact', {title: pageTitle})
})

router.post('/', function(req, res, next) {
	console.log(req.body)
	var firstName = req.body['first-name']
	var lastName = req.body['last-name']
	var email = req.body.email
	var subject = req.body.subject
	var body = req.body.body

	mySQL.getConn(function(err, connection) {
		if (err) throw err;
		connection.query("INSERT INTO emails VALUES (null, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)", [firstName, lastName, email, subject, body], function(err, results, fields) {
			if (err) throw err
			connection.release()
			res.redirect('/thanks')
		})
	})
})

module.exports = router;

