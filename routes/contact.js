const express = require('express');
const app = express();
const router = express.Router();
const mySQL = require('../my_sql_setup.js');
const nodemailer = require('nodemailer');
const request = require('request');
const secret = require('../secret')

// Comment this out when in production
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		type: 'OAuth2',
		user: 'kellan.martin@gmail.com',
		clientId: secret.gmailID(),
		clientSecret: secret.gmailSecret(),
		refreshToken: '1/LzF8VaVjSbhRCnsZHF5ozZmjraSWWviIp2Q9bbLHY9E',
		accessToken: 'ya29.Glt1BMJZz01Ca5maPJqctrnRmxKtAgt7KzI7cj-freR3GJ52U6kP8xJqpH3rvSldN0nES8gBo--H5NNpMfWL2EnaLVWtCkxfAfKIsh2kF134aAKwI9WG0SEkTaXo'
	}
})

function verifyCaptcha(emailObj) {
	return new Promise(function ( resolve, reject ) {
		captchaSecret = secret.captchaSecret()
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
	.catch(console.error)
	.done()
})

module.exports = router;

