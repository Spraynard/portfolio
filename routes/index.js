/* jshint esversion:6 */
var express = require('express');
var router = express.Router();
var decrypt = require('../userDecrypt');
var userCheck = require('../userCheck');
var debug = require('debug')('portfolio:index.js');

/* GET home page. */
var user = null;
var errorMsg = null;

let desc = "Kellan Martin - Freelance Web Developer Currently Located in Kalamazoo, MI. Completely client oriented and capable of using the latest web technologies to the clients advantage!";

router.get('/', function(req, res, next) {
	user = userCheck.validateCookie(req);
	errorMsg = userCheck.hasErrorMsg(req);
	userCheck.clearError(res);

	var images = ['/images/large-screen/building_seeing.jpg',
					'/images/large-screen/mounts.jpg',
					'/images/large-screen/wood_walkin.jpg'];

	var pageTitle = req.app.locals.websiteName + " | Web Developer";

	var model = {
		Languages: ['Python', 'JavaScript', 'PHP', 'C'],
		Libraries: ['jQuery', 'Bootstrap'],
		'CSS Pre-Processors': ['SASS'],
		'Frameworks (Front-End)': ['Knockout', 'Express', 'React'],
		'Frameworks (Back-End)' :['Node', 'Laravel'],
		'Templating Engines' : ['Jinja2', 'Blade', 'Pug'],
		CMSs: ['Wordpress', 'Squarespace'],
		'Operating Systems': ['Windows', 'macOS', 'Ubuntu']
	};
  	res.render('index', { title: pageTitle, model: model, user: user, error: errorMsg, page:'home', description: desc}, (err, html) => {
  		res.send(html);
  	});
});

module.exports = router;
