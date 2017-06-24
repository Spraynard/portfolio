const express = require('express');
const app = express();
const router = express.Router();
const mySQL = require('../my_sql_setup.js');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

var xoauth2gen = xoauth2.createXOAuth2Generator({
	user: 'kellan.martin@gmail.com',
	clientId: '290334206031-kkjtdkcb332613huo6brib90hn24c12b.apps.googleusercontent.com',
	clientSecret: 'EGje7rbGlgt5hIe-7r4Jyrow',
	refreshToken: '1/Kx2z3ouoO8WEjKWj7YB3pPiPfdXsuN918N4fAJ7a-FM',
})

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		type: 'OAuth2',
		user: 'kellan.martin@gmail.com',
		clientId: '290334206031-kkjtdkcb332613huo6brib90hn24c12b.apps.googleusercontent.com',
		clientSecret: 'EGje7rbGlgt5hIe-7r4Jyrow',
		refreshToken: '1/Kx2z3ouoO8WEjKWj7YB3pPiPfdXsuN918N4fAJ7a-FM',
		accessToken: 'ya29.GltzBLlZOgGooJkfI3CkNIMusmpFh5Wkt-cXN39xJdwsIuaK5ZengKwU6NBFjh77shSsxMNVBrxRKINH89XZm2SsMTFLgjkS4rywyFOdXa1mILppalKjeEfPPj_g'
	}
})

function sendEmail(emailObj) {
	var mailOptions = {
		from: emailObj.firstName + ' ' + emailObj.lastName + ' <' + emailObj.email + '>',
		to: 'kellan.martin@gmail.com',
		subject: emailObj.subject,
		text: emailObj.body
	}

	transporter.sendMail(mailOptions, function (err, res) {
		if (err) {
			console.error(err);
		}
		else {
			console.log("we just sent an e-mail!");
		}
	})
}

router.get('/', function(req, res, next) {
	var pageTitle = req.app.locals.websiteName + ' | Contact Me';
	res.render('contact', {title: pageTitle})
})

router.post('/', function(req, res, next) {
	console.log(req.body)

	var emailObj = {
		firstName: req.body['first-name'],
		lastName: req.body['last-name'],
		email: req.body.email,
		subject: req.body.subject,
		body: req.body.body
	}

	mySQL.getConn(function(err, connection) {
		if (err) throw err;
		connection.query("INSERT INTO emails VALUES (null, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)", [emailObj.firstName, emailObj.lastName, emailObj.email, emailObj.subject, emailObj.body], function(err, results, fields) {
			if (err) throw err
			connection.release()
			sendEmail(emailObj);
			res.redirect('/thanks');
		})
	})
})

module.exports = router;

