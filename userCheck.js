var express = require('express')
var decrypt = require('./userDecrypt')

//	Summary: This module is used to validate cookies for less code in the router
//	Parameters: a HTTP request
//	Returns: A valid user object. Will throw an error if the user is not valid.
exports.validateCookie = function(request) {
	if (Object.keys(request.cookies).length !== 0) {
		var adminCookie = null
		var cookieObj = {name: '', type: ''};

		var unCookie = request.cookies['username'];

		if (request.cookies['type'] === 'admin') {
			var adminCookie = 'admin'
		}
		//If cookie is '', user is logged out so there is no user at
		//  the time.
		if (unCookie === undefined) {
			return
		}
		if (unCookie === '') {
			return null
		}
		var cookieArray = unCookie.split('-');
		//Checking the encryption on the cookie to see if it validates
		var cookieDecrypt = decrypt.encryptedString(cookieArray[1]);
		if (cookieArray[0] !== cookieDecrypt) {
			throw err;
		}
		else {
			cookieObj.name = cookieArray[0]
			cookieObj.type = adminCookie
			return(cookieObj)
		}
	}
	else {
		return null
	}
}

//	Summary: Used to validate permissions of the user
//	Parameters: a HTTP request
//	Returns: Error message if the user has an error message
exports.hasErrorMsg = function(request) {
	if (Object.keys(request.cookies).length !== 0) {
		var errorMsg = request.cookies['error']
		if (errorMsg === '') {
			return null
		}
		return errorMsg
	}

}

//	Summary: Used to clear any error cookies from the header
//	Parameters: a HTTP response
//	Returns: None, just sets the cookie to ''
exports.clearError = function(response) {
	response.cookie('error', '', {path: '/'})
}