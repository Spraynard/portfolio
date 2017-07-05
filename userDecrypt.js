//Decrypts whatever string I put in, based on the encryption
//	parameters from before.

//Module called with an ecrypted string and returns the string in 
//	decrypted form.
crypto = require('crypto');
password = require('./secret');

exports.encryptedString = function(encString) {
	decrypt = crypto.createDecipher('BF', password.userSecret())
	let decrypted = '';

	decrypt.on('readable', function() {
		const data = decrypt.read();
		if (data) {
			decrypted += data.toString('utf8');
		}
	})

	decrypt.on('error', function(err) {
		console.error(err);
	})

	decrypt.write(encString, 'hex');
	decrypt.end();
	return decrypted
}