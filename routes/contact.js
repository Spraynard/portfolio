const express = require('express');
const app = express();
const router = express.Router();
const mySQL = require('../my_sql_setup.js');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const https = require('https');
const request = require('request');

// Comment this out when in production

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
		refreshToken: '1/64LVJe7fc_vnJz_xEOeIN4swIYceXLWfeSoy9LGD0uQ',
		accessToken: 'ya29.Glt1BLqgOA1BS8NQSg1ZMD1b3n1UPPdF97blIyyR0LnavGMhsmtdDGCLCDvUtY85D_tK0Ky5YVJcgcst8g7u7pkSJAxjoDZtd_I2dFQ1NcMViwhILg1QPB6sp8hv'
	}
})

function verifyCaptcha(emailObj) {
	return new Promise(function ( resolve, reject ) {
		captchaSecret = '6LeRwiYUAAAAAGSraYezvJqtw4buEIPef1gzu4ur'
		if (emailObj.recaptcha === '') {
			reject('No Captcha Response')
		} 
		request({
			method: 'POST',
			baseUrl: 'https://www.google.com/',
			uri: '/recaptcha/api/siteverify?secret='+captchaSecret+'&response='+emailObj.recaptcha
		}, function(err, res, body) {
			if (err) reject(err)
			else if (JSON.parse(body).success) {
				// Send Email if success = `true`
				resolve(emailObj)
			} 
			else {
				reject("There was not a success with the captcha")
			}
		})
	})
}

function sendEmail(emailObj) {

	return new Promise( function ( resolve, reject ) {
		var mailOptions = {
			from: emailObj.firstName + ' ' + emailObj.lastName + ' <' + emailObj.email + '>',
			to: 'kellan.martin@gmail.com',
			subject: emailObj.subject,
			text: emailObj.body
		}

		transporter.sendMail(mailOptions, function (err, res) {
			if (err) reject(err)
			else {
				console.log("we just sent an e-mail!");
				resolve(emailObj)
			}
		})
	})
}

function saveEmail(emailObj) {
	return new Promise( function ( resolve, reject ) {
		mySQL.getConn(function(err, connection) {
			if (err) reject(err);
			connection.query("INSERT INTO emails VALUES (null, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)", [emailObj.firstName, emailObj.lastName, emailObj.email, emailObj.subject, emailObj.body], function(err, results, fields) {
				connection.release()
				if (err) reject(err);
				else{
					resolve("Email has been saved!")
				}
			})
		})
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
	
	verifyCaptcha(emailObj)
	.then(sendEmail)
	.then(saveEmail)
	.then(console.log)
	.then(null, console.error)
	.done()
})

module.exports = router;

