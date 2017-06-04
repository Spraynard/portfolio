// This will be complete functionality for the blog
//	In my home site
var express = require('express');
var path = require('path');
var multer = require('multer');
var decrypt = require('../userDecrypt');
var mysql = require('mysql');
var mySQL = require('../my_sql_setup.js');
var userCheck = require('../userCheck');
var router = express.Router();
var app = express();
// var relativePath = '../public/images/uploads'
// var uploadFolder = path.join(__dirname, relativePath);
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/blog/')
	},
	filename: function (req, file, cb) {
		console.log(file)
		cb(null, file.originalname)
	}
})
var upload = multer({ storage: storage })

var user = null
var page = 'blog'

// Back End Functionality for Displaying Blog Posts (Main blog page, as well as single posts)

function callback(req, res, posts) {
	// Setting the title for the page
	var pageTitle = req.app.locals.websiteName + ' | A Beggar\'s Blog'
	user = userCheck.validateCookie(req);
	for (p in posts) {
		console.log(posts[p])
	}
	res.render('blog', {title: pageTitle, posts: posts, user: user, page: page});
	res.end();
}

function loadAllPosts(req, res, next) {
	var posts = null;
	mySQL.getConn(function(err, connection) {
		if (err) {throw err};
		connection.query("SELECT * FROM post ORDER BY ID DESC", function(err, results, fields) {
			console.log("querying the database");
			connection.release()
			if (results) {
				posts = results;
				callback(req, res, posts);
			}
		})
	})
}

function singleCallback(req, res, post, comments) {
	// Dynamic page title based on the blog post title
	var pageTitle =  req.app.locals.websiteName + ' | ' + post.title
	user = userCheck.validateCookie(req);
	res.render('singlepost', {title: pageTitle, post: post, user: user, page: page, comments: comments});
	res.end();
}

function loadSinglePost(req, res, next) {
	// Up Next: Implementation of a comments section for every single post.
	// 	will probably include all of this in a module, to reduce the code in this 
	var post = null
	var com = null
	var postID = req.query['post']
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
					console.log("This is results2", results2);
					com = results2;
					console.log(com)
					singleCallback(req, res, post, com);
				})
			}
		})
	})	
}

router.get('/', function(req, res, next) {
	if (req.query['singlepost']){
		loadSinglePost(req, res, next);
	}
	else {
		loadAllPosts(req, res, next);
	}
});
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
	console.log(req.body)
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
	
	var postInfo = {
		'pic': null,
		'body': null,
		'category': null,
		'title' : null,
		'tags' : null,
		'date' : null,
	};

	postInfo['date'] = res.app.locals.moment().format('MM/DD/YYYY')

	if (req.file !== undefined) {
		postInfo['pic'] = req.file.filename
	}

	postInfo['title'] = req.body.title;
	postInfo['category'] = req.body.category;
	postInfo['body'] = req.body.body;

	if (req.body.tags !== '') {
		postInfo['tags'] = req.body.tags;
	}

	mySQL.getConn(function(err, conn) {
		if (err) {throw err};
		conn.query("INSERT INTO post VALUES (null, ?, ?, ?, ?, ?, ?, null)", [postInfo['pic'], postInfo['title'], postInfo['category'], postInfo['body'], postInfo['tags'], postInfo['date']], function(error, results, fields) {
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
	var body = req.body.body
	var tags = req.body.tags

	mySQL.getConn(function(err, conn) {
		if (err) throw err;
		conn.query("UPDATE post set title = ?, body = ?, tags = ? WHERE id = ?", [title, body, tags, id], function(err, results, fields) {
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