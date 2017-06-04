// YO, REFACTOR THIS POS NOW, LOL!!!!

$(function() {

	function removeWhiteSpace(string) {
		string = string.replace(/\s/g, '')
		return string
	}

// Functions used to toggle between edit mode
// 	and regular display mode
	function toggleFrontEnd() {
		// Toggles visibility of all `.front-end` classed html
		var frontEndDoms = $(".front-end");
		$(frontEndDoms).toggle()
	}

	function toggleEdit(editDoms) {
		// Toggles visibility of all `.edit` classed html
		var editDoms = $(".edit")
		$(editDoms).toggle()
		var toggled = editDoms.is(':visible')
		console.log(toggled)
		$('#start-edit-button').text(toggled == true ? 'Cancel' : 'Edit Post')
	}

	function toggleConfirm() {
		$('button#confirm-edit-button').toggle()
	}

	function toggleEditMode() {
		toggleFrontEnd();
		toggleEdit();
		toggleConfirm();
	}
// 

	function toggleProjectEdit() {
		// Initializer for edit mode.
		var headerEdit = $("#header-edit");
		var startDateEdit = $("#start-date-edit");
		var endDateEdit = $("#end-date-edit");
		var bodyEdit = $("#project-body-edit");
		var techEdit = $("#tech-edit");

	// Getting ahold of the values of the front-end dom objects
		var $startDateValue = $("#start-date").text();
		var $endDateValue = $("#end-date").text();
		var $projectTitle = $("#project-header").text();
		var $projectTechs = $("#techs").text();
		var $projectBody = $("#project-body-wrapper").text();
	
	// Extracting `qual items`
		var qualItemString = '';
		var string

		$(".qualitem").each(function(item) {
			console.log(item)
			if ( item === $(".qualitem").length - 1 ) {
				string = $(this).text();
			}
			else {
				string = $(this).text() + ', ';		
			}
			qualItemString += string;
		})

		toggleEditMode();

		headerEdit.val($projectTitle);
		startDateEdit.val($startDateValue);
		endDateEdit.val($endDateValue);
		bodyEdit.val($projectBody);
		techEdit.val(removeWhiteSpace(qualItemString));
	}

	function produceTechTemplate(text) {
		// returns a template for `qualitem` classed divs
		return '<div class="qualitem">' + text + '</div>'
	}

	function replaceTechs(techString, techWrapper) {
		// Builds an injection string and then injects
		// 	all of the `qualitem` classed divs into
		// 	the techwrapper.
		var techInjection = '';
		var techArray = techString.split(',');
		techArray.forEach(function(tech) {
			var techHTML = produceTechTemplate(tech);
			techInjection += techHTML;
		})
		techWrapper.html(techInjection);
	}

	function saveProjectChanges() {
		// Updates the MySQL database rows for 
		// 	the current project.
		var $title = $('#project-header');
		var $body = $('#project-body-wrapper');
		var $startDate = $('#start-date');
		var $endDate = $('#end-date');
		var $techWrapper = $('#qualwrapper');

		var $titleEdit = $('#header-edit').val();
		var $bodyEdit = $('#project-body-edit').val();
		var $startDateEdit = $('#start-date-edit').val();
		var $endDateEdit = $('#end-date-edit').val();
		var $techEdit = $('#tech-edit').val();

		var data = {
			title: $titleEdit,
			body: $bodyEdit,
			startDate: $startDateEdit,
			endDate: $endDateEdit,
			tech: $techEdit
		}

		console.log(data);

		// When editing is done, make a call to the back end 
		// 	"/projects/edit" Project route, updating rows in DB.
		// Back end sends a `successObj` response of the updated post object,
		// 	The DOM is then updated through this AJAX call.
		$.post("/projects/edit", data , function(successObj) {
			console.log(successObj)
			successObj = successObj[0]
			var currentTitle = successObj.title;
			var currentBody = successObj.body;
			var currentStartDate = successObj['start_date'];
			var currentEndDate = successObj['end_date'];
			var currentTechs = successObj.tech;
			console.log("This is current techs:", currentTechs)

			toggleEditMode();

			$title.text(currentTitle);
			$body.text(currentBody);
			$startDate.text(currentStartDate)
			$endDate.text(currentEndDate)
			replaceTechs(currentTechs, $techWrapper);
		})
	}
	
	$('#start-edit-button').on('click', function() {
		toggleProjectEdit();
	})

	$('#confirm-edit-button').on('click', function() {
		// Error check, and then confirm.
		if (confirm('Change this Project?')) {
			saveProjectChanges()
		}
		else {
			return
		}
	})
})