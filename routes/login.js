var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var mySQL = require('../my_sql_setup.js')
var encrypt = require('../userEncrypt');

router.get('/', function(req, res, next) {
	res.render('login')
})

function resultsCheck (authArray, req, res, username) {
	if (authArray[0] === 1 && authArray[1] === 1) {
		var userArray = [];
		userArray[0] = username;
		userArray[1] = encrypt.string(username);
		res.cookie('username', userArray.join('-'), {path: '/'})
		res.send("yes")
		res.end()
	}
	else {
		res.send(authArray)
		res.end()
	}
}

router.post('/', function(req, res, next) {
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
				resultsCheck(auth, req, res, username)
				return
			}
			if (results[0].username === username) {
				console.log("un good")
				auth[0] = 1;
			}
			if (results[0].password === encryptedPassword) {
				console.log("pw good")
				auth[1] = 1;
			}
			resultsCheck(auth, req, res, username);
		})
	})
})

module.exports = router