$(function () {
	// Grabbing Input Elements from DOM
	var $firstName = $('#firstName');
	var $lastName = $('#lastName');
	var $email = $('#email');
	var $subject = $('#subject');
	var $body = $('#body');
	var $submitButton = $('#submit-button');

	// Grabbing Error Elements from DOM
	var $firstNameError = $('#first-name-error');
	var $lastNameError = $('#last-name-error');
	var $emailError = $('#email-error');
	var $subjectError = $('#subject-error');
	var $bodyError = $('#body-error');

	$submitButton.on('click', function() {
		errorCheckAndSend()
	})

	function isEmpty(element) {
		if (element.val().trim() == "") {
			return true
		}
		return false
	}

	function errorCheckAndSend() {
		errorObj = {
			'firstName': null,
			'lastName': null,
			'email': null,
			'subject': null,
			'body': null
		}

		var error = 0;

		if (isEmpty($firstName)) {
			error = 1;
			errorObj.firstName = "Please give me your first name."
		}
		if (isEmpty($lastName)) {
			error = 1;
			errorObj.lastName = "Please give me your last name."
		}
		if (isEmpty($email)) {
			error = 1;
			errorObj.email = "Please give me your e-mail address."
		}
		if (isEmpty($subject)) {
			error = 1;
			errorObj.subject = "Please let me know why you're emailing me."
		}
		if (isEmpty($body)) {
			error = 1;
			errorObj.body = "Don't send me an e-mail without a body. That's mean."
		}
		if (error === 1) {
			$firstNameError.text(errorObj.firstName)
			$lastNameError.text(errorObj.lastName)
			$emailError.text(errorObj.email)
			$subjectError.text(errorObj.subject)
			$bodyError.text(errorObj.body)
		}
		else {
			$('#contact-form').submit()
		}
	}
})

