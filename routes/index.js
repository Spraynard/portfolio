var express = require('express');
var router = express.Router();
var decrypt = require('../userDecrypt');
var userCheck = require('../userCheck');
/* GET home page. */
var user = null
var errorMsg = null

let desc = "Kellan Martin - Freelance Web Developer Currently Located in Kalamazoo, MI. Completely client oriented and capable of using the latest web technologies to the clients advantage!"
 
router.get('/', function(req, res, next) {
	user = userCheck.validateCookie(req);
	errorMsg = userCheck.hasErrorMsg(req);
	userCheck.clearError(res);

	var images = ['/images/large-screen/building_seeing.jpg',
					'/images/large-screen/mounts.jpg',
					'/images/large-screen/wood_walkin.jpg']

	var pageTitle = req.app.locals.websiteName + " | Web Developer"

	var model = {
		Languages: ['Python', 'Ruby', 'JavaScript', 'Java', 'PHP', 'OCaml', 'Swift', 'Haskell','HTML', 'CSS'],
		Libraries: ['jQuery', 'Bootstrap'],
		'Pre-Processors': ['SASS', 'Pug'],
		Frameworks: ['Knockout.js', 'Express.js', 'Jinja2'],
		Runtimes: ['Node.js'],
		CMSs: ['Wordpress', 'Squarespace']
	}
  	res.render('index', { title: pageTitle, model: model, user: user, error: errorMsg, page:'home', description: desc}) //pics: images});
});

module.exports = router;
