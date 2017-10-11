var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var mySQL = require('../my_sql_setup.js')
var encrypt = require('../userEncrypt');

router.get('/', function(req, res, next) {
	res.render('login', (err, html) => {
		res.send(html);
	})
})

function resultsCheck (authArray, req, res, userObject) {
	// Summary: Callback function checking the results of the POST to the login page. Adds
	// 			cookies to the user if they do authorize, and sends back the authArray if they do not,
	// 			which will update the frond end using AJAX.
	// Params: Autharray - Length 2 array that, when used as a response to the front end, lets the user know
	// 						whether or not their username or password is the problem
	//			req - A HTTP request stream
	// 			res - A HTTP response stream
	//			userObject - If everything checks out with the post function, the userObject will contain info from the db
	// Returns: Either adds cookies or sends a response to the front end to dynamically tell a user that they are doing bad things 
	if (authArray[0] === 1 && authArray[1] === 1) {
		var userArray = [];
		userArray[0] = userObject.username;
		userArray[1] = encrypt.string(userObject.username);
		res.cookie('username', userArray.join('-'), {path: '/'})
		if (userObject.type === 'admin') {
			res.cookie('type', 'admin', {path: '/'})
		}
		res.send("yes")
		res.end()
	}
	else {
		res.send(authArray)
		res.end()
	}
}

router.post('/', function(req, res, next) {
	var userObject = null;
	var username = req.body.username
	var password = req.body.password
	var encryptedPassword = encrypt.string(password);
	var auth = [0,0]
	mySQL.getConn(function(err, connection) {
		if (err) {throw err};
		var sql = "SELECT * FROM ?? WHERE ?? = ?";
		var inserts = ['users', 'username', username]
		sql = mysql.format(sql, inserts)
		connection.query(sql, function (error, results, fields) {
			connection.release();
			if (error) throw error;
			if (results[0] === undefined) {
				resultsCheck(auth, req, res, userObject)
				return
			}

			userObject = results[0]
			
			if (results[0].username === username) {
				auth[0] = 1;
			}
			if (results[0].password === encryptedPassword) {
				auth[1] = 1;
			}
			resultsCheck(auth, req, res, userObject);
		})
	})
})

module.exports = router