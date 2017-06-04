var mysql = require('mysql')
var pool = mysql.createPool ({
	host: 'localhost',
	user: 'kellan_martin',
	password: 'Limester91!',
	database: 'kwm_portfolio'
})

exports.getConn = function(callback) {
	pool.getConnection(function(err, conn) {
		if (err) {
			return callback(err);
		}
		callback(err, conn);
	});
};