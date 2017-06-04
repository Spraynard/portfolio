// Creating an encryption system so that people will have
//	a hard time getting admin status :)

// This module will called with a non-encrypted string input and will
//	return an encrypted string that can be used for un & pw encryption
crypto = require('crypto');
password = require('./secret');

exports.string = function(string) {
	encrypt = crypto.createCipher('BF', password())
	let encrypted = '';

	encrypt.on('readable', function() {
		const data = encrypt.read()
		if (data) {
			encrypted += data.toString('hex')
		}
	})

	encrypt.on('error', function(err) {
		console.error(err);
	})

	encrypt.write(string);
	encrypt.end();
	return encrypted
}