exports.cookieDivide = function(name, value, cookieString) {
	var cookiesArray = cookieString.split(";");
	for (c in cookiesArray) {
		var cookieArray = cookiesArray[c].split("=")
		if (cookieArray[0].replace(/\s/g, "") === name) {
			cookieArray[1] = value
			cookiesArray[c] = cookieArray.join("=")
		}
	}
	return cookiesArray.join(";")
}