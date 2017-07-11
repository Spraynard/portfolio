const express = require('express');
const router = express.Router()


router.get('/', (req, res, next) => {
	res.render('main-dev_test', {title: 'Dev_test'})
})

router.post('/main-api-call', (req, res, next) => {
	console.log(req.body)
	console.log(req.headers['content-type'])
	var url = 'https://sauron.api.influentialdev.com/stream'
	if (req.headers['content-type'] === 'application/json') {
		if (req.body.type === 'coords') {
			var lat = req.body.lat;
			var lng = req.body.lng;
			// Request call to API server is then piped back to the response
			// locationRequest = request(url + '?lat=' + lat + '&lng=' + lng)
			
			// locationRequest.on('response', (res) => {
			// 	console.log(res)
			// })

			// locationRequest.on('error', (err) => {
			// 	console.error(err)
			// })

			// locationRequest.pipe(res)
			request
				.get(url + '?lat=' + lat + '&lng=' + lng)
				.on('response', (res) => {
					console.log(res)
				})
				.on('error', (err) => {
					console.err(err)
				})
				.pipe(res)
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