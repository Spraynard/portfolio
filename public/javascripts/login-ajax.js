$(function() {
	var path = "/admin/login"

	function adminAjaxCall () {
		$("#username-alert").val("")
		$("#password-alert").val("")
		var $username = $("#username").val()
		var $password = $("#password").val()
		var params = {username: $username, password: $password}
		var usernameError = "";
		var passwordError = "";

		$.post(path, params, function(data) {
			console.log("Getting: ", data)
			if (data[0] === 0 && data[1] === 0) {
				usernameError = "That username is not recognized";
				passwordError = "That Password is not recognized";
			}
			if (data[0] === 1 && data[1] === 0) {
				passwordError = "Wrong Password!!"
			}
			if (data[0] === 0 && data[1] === 1) {
				usernameError = "Wrong Username"
			}
			else {
				if (data === "yes") {
					window.location.href = "/";
				}
			}
			$("#username-alert").text(usernameError)
			$("#password-alert").text(passwordError)
		})
	}

	$(document).on("keypress", function(e) {
		if (e.keyCode === 13) {
			adminAjaxCall();
		}
	})

	$("#login-submit").on('click', function() {
		adminAjaxCall();
	})
})