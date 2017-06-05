// YO, REFACTOR THIS POS NOW, LOL!!!!

$(function() {

	var header = $("#project-header");
	var startDate = $("#start-date");
	var endDate = $("#end-date");
	var qualItems = $(".qualitem");
	var body = $("#project-body-wrapper");
	var techs = $("#techs");

	var headerEdit = $("#header-edit");
	var startDateEdit = $("#start-date-edit");
	var endDateEdit = $("#end-date-edit");
	var bodyEdit = $("#project-body-edit");
	var techEdit = $("#tech-edit");

	function removeWhiteSpace(string) {
		string = string.replace(/\s/g, '')
		return string
	}

	function getFrontEndValues() {

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
	function getQualItems() {
		var qualItemString = '';
		var string

		$(qualItems).each(function(item) {
			console.log(item)
			if ( item === $(".qualitem").length - 1 ) {
				string = $(this).text();
			}
			else {
				string = $(this).text() + ', ';		
			}
			qualItemString += string;
		})
		return qualItemString
	}

	function getFrontEndValues() {
		var obj = {
			startDateValue: startDate.text(),
			endDateValue: endDate.text(),
			headerValue: header.text(),
			bodyValue: body.html(),
			qualItemsValue: getQualItems()
		}
		return obj;
	}

	function getEditValues() {
		var obj = {
			startDate: startDateEdit.val(),
			endDate: endDateEdit.val(),
			title: headerEdit.val(),
			body: bodyEdit.val(),
			tech: techEdit.val()
		}
		return obj;
	}

	function toggleProjectEdit() {
		// Getting ahold of the values of the front-end dom objects
		vals = getFrontEndValues()
		$startDateValue = vals.startDateValue
		$endDateValue = vals.endDateValue
		$headerValue = vals.headerValue
		$bodyValue = vals.bodyValue
		$qualItemsValue = vals.qualItemsValue
	
	// Extracting `qual items`

		toggleEditMode();

		headerEdit.val($headerValue);
		startDateEdit.val($startDateValue);
		endDateEdit.val($endDateValue);
		bodyEdit.val($bodyValue);
		techEdit.val(removeWhiteSpace($qualItemsValue));
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

		vals = getEditValues()

		var data = {
			title: vals.title,
			body: vals.body,
			startDate: vals.startDate,
			endDate: vals.endDate,
			tech: vals.tech
		}

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

			toggleEditMode();

			header.text(currentTitle);
			body.html(currentBody);
			startDate.text(currentStartDate)
			endDate.text(currentEndDate)
			replaceTechs(currentTechs, techs);
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