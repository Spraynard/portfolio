const express = require('express');
const app = express();
const router = express.Router();
const mySQL = require('../my_sql_setup.js');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const https = require('https');
const request = require('request');
const promise = require('promise');

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
		refreshToken: '1/82wLoczhFwtaZHVabnVm-bipjmFXFQjFXcpU4PjFR7Xt00xgtoJJoKNN3jzsbEKc',
		accessToken: 'ya29.Glt0BG5VUb_l0CL8GZUC3mzZoM3yBxHAH3xqFmw8AYIjmcvyLJhhyeHa-1yuTK81mosd0OE7Ww78AN2M3yC7MMKll7OMfswcsgsHRiFTGnpZNc_1pM1l4u8ITgkI'
	}
})

function verifyCaptcha(emailObj) {
	captchaSecret = '6LeRwiYUAAAAAGSraYezvJqtw4buEIPef1gzu4ur'

	request({
		method: 'POST',
		baseUrl: 'https://www.google.com/',
		uri: '/recaptcha/api/siteverify?secret='+captchaSecret+'&response='+emailObj.recaptcha
	}, function(err, res, body) {
		if (err) {
			console.error(err)
			return
		} else if (JSON.parse(body).success) {
			// Send Email if success = `true`
			sendEmail(emailObj)
		} else {
			console.log("There was not a success with the captcha")
			return
		}
	})
}

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
		} else {
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
		body: req.body.body,
		recaptcha: req.body['g-recaptcha-response']
	}

	mySQL.getConn(function(err, connection) {
		if (err) throw err;
		connection.query("INSERT INTO emails VALUES (null, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)", [emailObj.firstName, emailObj.lastName, emailObj.email, emailObj.subject, emailObj.body], function(err, results, fields) {
			if (err) throw err
			connection.release()
		// If captcha is verified, then email will be sent.
			verifyCaptcha(emailObj);
			res.redirect('/thanks');
		})
	})
})

module.exports = router;

