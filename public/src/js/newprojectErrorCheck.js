$(function() {

	var path = '/projects/newproject';
	var $projectForm = $('#project-form');
	var $projectPicAlert = $('#project-pic-alert');
	var $projectTitleAlert = $('#project-title-alert');
	var $projectBodyAlert = $('#project-body-alert');
	var $projectDateAlert = $('#project-date-alert');
	var $projectTechAlert = $('#project-tech-alert');
	var $title = $('#project-input-title');
	var $technologies = $('#project-input-technologies');
	var $body = $('#project-input-body');
	var $pictures = $('#project-input-pic');
	var $startDay = $('#project-input-start-day');
	var $startMonth = $('#project-input-start-month');
	var $startYear = $('#project-input-start-year');
	var $endDay = $('#project-input-end-day');
	var $endMonth = $('#project-input-end-month');
	var $endYear = $('#project-input-end-year');

	function newprojectSubmit () {

		var errorObj = {
			'title': null,
			'body': null,
			'picture': null,
			'date': null,
			'technologies': null
		};

		$projectPicAlert.text("");
		$projectTitleAlert.text("");
		$projectBodyAlert.text("");
		$projectDateAlert.text("");

		var title = $title.val();
		var body = tinymce.get('project-input-body').getContent();
		var pictures = $pictures.val();
		var tech = $technologies.val();
		var dateString = $startMonth + ' ' + $startDay + ', ' + $startYear;
		var startDate = new Date($startMonth.val() + ' ' + $startDay.val() + ', ' + $startYear.val());
		var endDate = new Date($endMonth.val() + ' ' + $endDay.val() + ', ' + $endYear.val());
		var error = 0;

		if (pictures === '') {
			errorObj['picture'] = "You must have at least one picture"
			error = 1;
		}
		if (title.length === 0) {
			errorObj['title'] = "You must have a title";
			error = 1;
		}
		if (body.length === 0) {
			errorObj['body'] = "You must have a body";
			error = 1;
		}
		if (startDate > endDate) {
			errorObj['date'] = "The start date cannot be at a later time than the end date"
			error = 1;
		}
		if (startDate.getTime() === endDate.getTime()) {
			errorObj['date'] = "The start date cannot be the same as the end date"
			error = 1;
		}
		if (tech.length === 0) {
			errorObj['technologies'] = "You must have used at least one technology"
			error = 1;
		}
		if (error === 1) {
			$projectTitleAlert.text(errorObj['title']);
			$projectBodyAlert.text(errorObj['body']);
			$projectPicAlert.text(errorObj['picture']);
			$projectDateAlert.text(errorObj['date']);
			$projectTechAlert.text(errorObj['technologies']);
		}
		else {
			$projectForm.submit();
		}
	}

	$('#project-submit').on('click', function() {
		newprojectSubmit();
	})

})