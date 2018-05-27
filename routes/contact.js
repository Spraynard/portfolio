const express = require('express');
const app = express();
const router = express.Router();
const mySQL = require('../my_sql_setup.js');
const nodemailer = require('nodemailer');
const request = require('request');
const secret = require('../secret');

// Comment this out when in production
var transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		type: 'OAuth2',
		user: 'kellan.martin@gmail.com',
		clientId: secret.gmailID(),
		clientSecret: secret.gmailSecret(),
		refreshToken: '1/Vbu9SCGyxj2XELpvID1AdHPDFjHr_ASNhAJf-IEKeB8',
		accessToken: 'ya29.Glt2BMSadOK2WV-hwv6CeCQoIyXQryhvXRR04obGd6DmS1e2rFLztJxW24ecX_oLWRyjcN-Fj97QctxQBY_6ntdwlGg7_LTAIvMHlhzFNO3B_pw4PHVthfV-4VzN'
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
			subject: "Email From: " + '<' + emailObj.email + '> | ' + emailObj.subject,
			text: emailObj.body
		};

		transporter.verify( function( error, success ) {
			if (error) {
				console.log("Cannot Verify");
                reject(error);
			} else {
                console.log("This is a usable transporter");
            }
		})

		transporter.sendMail(mailOptions, function (err, res) {
			if (err) reject(err)
			else {
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
	let desc = "Contact Page - Kellan Martin - Freelance Web Developer currently based in Kalamazoo, MI. Completely client oriented and capable of using the latest web technologies to the client's advantage."
	var pageTitle = req.app.locals.websiteName + ' | Contact Me';
    var codeBase = process.env.NODE_ENV;
	res.render('contact', {title: pageTitle, description: desc, codebase: codeBase}); 
});

router.post('/', function(req, res, next) {

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
	.then(res.redirect('/thanks'))
	.catch(null, console.error)
})

module.exports = router;

