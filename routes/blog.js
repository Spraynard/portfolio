// This will be complete functionality for the blog
//	In my home site
var express = require('express');
var path = require('path');
var multer = require('multer');
var decrypt = require('../userDecrypt');
var mysql = require('mysql');
var mySQL = require('../my_sql_setup.js');
var userCheck = require('../userCheck');
var debug = require('debug')('portfolio:blog');
var router = express.Router();
var app = express();
// var relativePath = '../public/images/uploads'
// var uploadFolder = path.join(__dirname, relativePath);
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/blog/')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})
var upload = multer({ storage: storage })

var user = null
var page = 'blog'

// Back End Functionality for Displaying Blog Posts (Main blog page, as well as single posts)

function callback(req, res, posts) {
	let desc = 'A Beggar\'s Blog - Kellan Martin - Freelance Web Developer Based in Kalamazoo, MI. Completely client oriented and capable of using the latest web technologies to the clients advantage!'
	// Setting the title for the page
	var pageTitle = req.app.locals.websiteName + ' | A Beggar\'s Blog'
	user = userCheck.validateCookie(req);
	res.render('blog', {title: pageTitle, posts: posts, user: user, page: page, description: desc}, (err, html) => {
		res.send(html);
	});
}

router.get('/', function(req, res, next) {
	var posts = null;
	mySQL.getConn(function(err, connection) {
		if (err) {throw err};
		connection.query("SELECT * FROM post ORDER BY ID DESC", function(err, results, fields) {
			connection.release()
			if (results) {
				posts = results;
				callback(req, res, posts);
			}
		})
	})
});

function singlePostCallback(req, res, post, comments) {
	// Dynamic page title based on the blog post title. stripped the HTML out of the title.
	var pageTitle =  req.app.locals.websiteName + ' | ' + post.title.replace(/<(?:.|\n)*?>/gm, '')
	user = userCheck.validateCookie(req);
	res.render('singlepost', {title: pageTitle, post: post, user: user, page: page, comments: comments}, (err, html) => {
		res.send(html);
	})
}

router.get('/:id/post/:title', (req, res, next) => {
	// Up Next: Implementation of a comments section for every single post.
	// 	will probably include all of this in a module, to reduce the code in this 
	var post = null
	var com = null
	const params = req.params;
	const postID = params.id
	// Setting `postID` local variable so `/edit` knows what 
	// 	post to update
	req.app.locals.postID = postID;
	mySQL.getConn(function(err, connection) {
		if (err) {throw err}
		connection.query('SELECT * FROM post WHERE id = ?', postID, function(err, results1, fields) {
			if (err) throw err;
			else if (results1) {
				post = results1[0];
				connection.query("SELECT * FROM comments WHERE postID = ? ORDER BY created DESC", postID, function(err, results2, fields) {
					connection.release()
					com = results2;
					singlePostCallback(req, res, post, com);
				})
			}
		})
	})
})

// End Single and Main Page Blog Post Functionality

// Comments AREA Post Request handling
function getTimestamp(dateObj) {
	var monthNames = ['January', 'February', 'March', 'April',
						'May', 'June', 'July', 'August', 'September',
						'October', 'November', 'December']

	var day = dateObj.getDate();
	var month = dateObj.getMonth();
	var year = dateObj.getUTCFullYear();

	var dateString = monthNames[month] + ' ' +  day + ', ' + year;
	return dateString;
}

router.post('/comments', function(req, res, next) {
	var name = req.body.name
	var date = new Date()
	var body = req.body.body
	var postID = req.app.locals.postID
	mySQL.getConn(function(err, conn) {
		if (err) throw err;
		conn.query('INSERT INTO comments VALUES (null, ?, ?, CURRENT_TIMESTAMP, ?, ?)', [postID, name, getTimestamp(date), body], function(err, results, fields) {
			if (err) throw err;
			res.send(true);
		})
	})
})
// End Comments area request handling

// Back End Functionality for New Posts
router.get('/newpost', function(req, res, next) {
	user = userCheck.validateCookie(req)

	if (user) {
		res.render('newpost', {user: user})
	}
	else {
		res.cookie('error', 'Permission Error: Not Logged In as Admin');
		res.redirect('/');
		res.end()
	}
})

router.post('/newpost', upload.single('header-pic'), function(req, res, next) {
	// Used to save a new post to the database
	var postInfo = {
		'pic': null,
		'body': null,
		'category': null,
		'title' : null,
		'url_title' : null,
		'tags' : null,
		'date' : null,
	};

	debug("You are posting this as a new-post: ", req.body)
	// This doesn't do anything right now
	postInfo['date'] = res.app.locals.moment().format('MM/DD/YYYY')

	if (req.file !== undefined) {
		postInfo['pic'] = req.file.filename
	}

	postInfo['title'] = req.body.title;
	postInfo['sub_title'] = req.body['sub-title'];
	postInfo['url_title'] = req.body.title.replace(/[\-:?!@#$%^&*()_+=|\}\]\[{;"'\/><.,]/g, '').replace(/<(?:.|\n)*?>/gm, '').toLowerCase().split(' ').join('-')
	postInfo['category'] = req.body.category;
	postInfo['body'] = req.body.body;

	if (req.body.tags !== '') {
		postInfo['tags'] = req.body.tags;
	}

	mySQL.getConn(function(err, conn) {
		if (err) {throw err};
		conn.query("INSERT INTO post VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?, null)", [postInfo['pic'], postInfo['title'], postInfo['sub_title'], postInfo['url_title'], postInfo['category'], postInfo['body'], postInfo['tags'], postInfo['date']], function(error, results, fields) {
				conn.release()
				if (error) {throw error};
				res.redirect('/blog');
		})
	})
	
})

// End New Post Back End

router.post('/edit', function(req, res, next) {
	var id = req.app.locals.postID
	var title = req.body.title
	var sub_title = req.body.subTitle;
	var url_title = req.body.title.replace(/[\-:?!@#$%^&*()_+=|\}\]\[{;"'\/><.,]/g, '').replace(/<(?:.|\n)*?>/gm, '').toLowerCase().split(' ').join('-')
	var body = req.body.body
	var tags = req.body.tags

	mySQL.getConn(function(err, conn) {
		if (err) throw err;
		conn.query("UPDATE post set title = ?, sub_title = ?, url_title = ?, body = ?, tags = ? WHERE id = ?", [title, sub_title, url_title, body, tags, id], function(err, results, fields) {
			if (err) throw err;
			conn.query("SELECT * from post WHERE id = ?", id, function(err, results, fields) {
				conn.release();
				if (err) throw err;
				res.send(results);
				res.end();
			})
		})
	})
})

module.exports = router;