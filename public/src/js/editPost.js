$(function() {

	var $title = $('#single-post-header');
	var $subTitle = $('#single-post-sub-header');
	var $body = $('#single-post-body-wrap')//$('#single-post-body');
	
	var $tags = $('#tags');

	var $titleEdit = $('#single-post-header-edit');
	var $subTitleEdit = $('#single-post-sub-header-edit');
	var $bodyEdit = $('#single-post-body-edit');
	var $tagsEdit = $('#post-tags-edit');

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
		$(editDoms).toggleClass('show')
		var toggled = editDoms.is(':visible')
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

	function togglePostEdit() {
		toggleEditMode()
		$titleEdit.val($title.html());
		$subTitleEdit.val($subTitle.html());
		// Using HTML to be able to correctly see what HTML is being put in this area
		$bodyEdit.val($body.html());
		$tagsEdit.val($tags.text());
	}

	function savePost() {
		var title, subTitle, body, tags

		var data = {
			title: $titleEdit.val(),
			subTitle : $subTitleEdit.val(),
			body: $bodyEdit.val(),
			tags: $tagsEdit.val(),
		}

		$.post("/blog/edit", data, function(successObj) {
			var obj = successObj[0];
			var newTitle = obj.title;
			var newSubTitle = obj['sub_title'];
			var newBody = obj.body;
			var newTags = obj.tags;

			toggleEditMode();

			$title.html(newTitle);
			$subTitle.html(newSubTitle);
			// On update, puts the HTML content from the text box into the body, not just the text
			$body.html(newBody);
			$tags.text(newTags);
		})
	}

	$("#start-edit-button").on('click', function() {
		togglePostEdit();
	})

	$("#confirm-edit-button").on('click', function() {
		if (confirm('Change this blog post?')) {
			savePost();
		}
		else {
			return
		}
	})
})