const express = require('express');
const router = express.Router();
const request = require('request');


router.get('/', (req, res, next) => {
	res.render('main-dev_test', {title: 'Dev_test'})
})

router.post('/main-api-call', (req, res, next) => {
	var url = 'https://sauron.api.influentialdev.com/stream'
	if (req.headers['content-type'] === 'application/json') {
		if (req.body.type === 'coords') {
			var lat = req.body.lat;
			var lng = req.body.lng;
			// Request call to API server is then piped back to the response
			request(url + '?lat=' + lat + '&lng=' + lng).pipe(res)
		} else if (req.body.type === 'id') {
			var id = req.body.id
			// Request call to API server to get information about pic based on id #
			request(url + '/' + id).pipe(res)
		} else {
			res.status(404);
			res.send("The server is getting JSON it doesn't know how to handle")
		}
	} else {
		res.send("Server must know if you're sending JSON info");
	}
})

module.exports = router