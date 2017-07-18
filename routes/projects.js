var express = require('express');
var router = express.Router();
var mySQL = require('../my_sql_setup.js');
var userCheck = require('../userCheck');

//This is going to be a multipart/form-data enc type,
//	So I need multer in order to look at the req.
var multer = require('multer');
// `storage` is the storage function used for multer
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'uploads/projects/')
	}
})
var upload = multer({storage: storage});

var user = null
var page = 'projects'

// Callback for displaying a `single project` page
function singleCallback(req, res, project) {
	// Dynamic page title of the project title
	var pageTitle = req.app.locals.websiteName + " | " + project.title
	user = userCheck.validateCookie(req);
	res.render('singleproject', {title: pageTitle, project: project, user: user, page: page})
	res.end();
}

// Callback for displaying `projects` page
function callback(req, res, projects) {
	// Setting the page title
	var pageTitle = req.app.locals.websiteName + " | Projects"
	user = userCheck.validateCookie(req);
	res.render('projects', {title: pageTitle, projects: projects, user: user, page: page})
}

//GET `Projects` Page
router.get('/', function(req, res, next) {
	// If the user clicks on a project, they should be taken
	// 	to a single page containing all the project information.
	// 	Maybe more. This occurs by adding a query string on to the URL
		// Will render the main projects page if url is without a 'singleproject' query
		var projects = null;
		mySQL.getConn(function(err, connection) {
	  	if (err) {throw err};
	  	connection.query("SELECT * FROM projects ORDER BY id DESC", function(err, results, fields) {
	  		connection.release()
	  		if(results) {
	  			projects = results;
	  			callback(req, res, projects);
	  		}
	  	})
	})
})

// This will be the route for single-projects
router.get('/:id/project/:title', (req, res, next) => {
	const params = req.params
	const id = params.id
	let project = null;

	// Putting this project id in a local so it can be used by the edit page
	req.app.locals.projectID = id;

	mySQL.getConn(function(err, connection) {
		if (err) {throw err};
		connection.query('SELECT * FROM projects WHERE id = ?', id, function(err, results, fields) {
			connection.release()
			if (results) {
				project = results[0];
				singleCallback(req, res, project);
			}
		})
	})	
})

router.get('/newproject', function(req, res, next) {
	user = userCheck.validateCookie(req)

	if (user) {
		res.render('newproject', {user: user})
	}
	else {
		res.cookie('error', 'Permission Error: Not Logged In as Admin');
		res.redirect('/');
		res.end();
	}
})

function getDate(dateObj) {
	var monthNames = ['January', 'February', 'March', 'April',
						'May', 'June', 'July', 'August', 'September',
						'October', 'November', 'December']

	var day = dateObj.getDate();
	var month = dateObj.getMonth();
	var year = dateObj.getUTCFullYear();

	var dateString = monthNames[month] + ' ' +  day + ', ' + year;
	return dateString;
}

// Post requests of `update` to this route will update body,
// 	title, startdate, enddate, website, and tech roles.

router.post('/newproject', upload.any(), function(req, res, next) {
	var postInfo = {
		'url_title': null,
		'pics': null,
		'body': null,
		'website': null,
		'title': null,
		'startDate': null,
		'endDate': null,
		'tech': null
	};

	if (req.files !== undefined) {
		var filenameArray = [];
		req.files.forEach(function(file) {
			filenameArray.push(file.filename);
		})
		postInfo['pics'] = filenameArray.join(",");
	}

	var startDate = req.body['start-month'] + ' ' + req.body['start-day'] + ', ' + req.body['start-year'];
	var endDate = req.body['end-month'] + ' ' + req.body['end-day'] + ', ' + req.body['end-year'];

	postInfo['title'] = req.body.title;
	postInfo['url_title'] = req.body.title.replace(/[\-:?!@#$%^&*()_+=|\}\]\[{;"'\/><.,]/g, '').replace(/<(?:.|\n)*?>/gm, '').toLowerCase().split(' ').join('-')
	postInfo['body'] = req.body.body;
	postInfo['startDate'] = startDate;
	postInfo['endDate'] = endDate;
	postInfo['tech'] = req.body.tech;
	postInfo['website'] = req.body.website;

	mySQL.getConn(function(err, conn) {
		if (err) {throw err};
		conn.query("INSERT INTO projects VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?)", [postInfo['title'], postInfo['url_title'], postInfo['website'], postInfo['tech'], postInfo['pics'], postInfo['startDate'], postInfo['endDate'], postInfo['body']], function(err, results, fields) {
			conn.release();
			if (err) {throw err};
		})
	})
	res.redirect('/projects');
})

router.post('/edit', function(req, res, next) {
	var id = req.app.locals.projectID
	var title = req.body.title
	var url_title = req.body.title.replace(/[:]/g, '').replace(/<(?:.|\n)*?>/gm, '').toLowerCase().split(' ').join('-')
	var body = req.body.body
	var startDate = req.body.startDate
	var endDate = req.body.endDate
	var website = req.body.website
	var tech = req.body.tech
	var link = req.body.link

	mySQL.getConn(function(err, conn) {
		if (err) throw err;
		conn.query("UPDATE projects SET title = ?, url_title = ?, website = ?, tech = ?, start_date = ?, end_date = ?, body = ? WHERE id = ?", [title, url_title, link, tech, startDate, endDate, body, id], function(err, results, fields) {
			if(err) throw err;
			conn.query("SELECT * from projects WHERE id = ?", id, function(err, results, fields) {
				conn.release();
				if (err) throw err;
				res.send(results);
				res.end();
			})
		})
	})
})

module.exports = router;