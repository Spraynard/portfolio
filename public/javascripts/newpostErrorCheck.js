$(function() {

	var path = '/blog/newpost';
	$postForm = $('#post-form');
	$titleAlert = $('#title-alert');
	$categoryAlert = $('#category-alert');
	$pictureAlert = $('#picture-alert');
	$bodyAlert = $('#body-alert');
	$tagAlert = $('#tag-alert')

	function newpostAjaxCall () {

		var errorObj = {
			'title': null,
			'category': null,
			'tags': null,
			'picture': null,
			'body': null
		}

		$titleAlert.text("");
		$categoryAlert.text("");
		$pictureAlert.text("");
		$bodyAlert.text("");
		$tagAlert.text("");

		var $title = $('#input-title').val();
		var $category = $('#input-category').val();
		var $tags = $('#input-tags').val();
		var $body = $('#input-body').val();


		var error = 0;

		if ($title.length === 0) {
			errorObj['title'] = "You must put something in the title space";
			error = 1;		
		}
		if ($category.length === 0) {
			errorObj['category'] = "You must put something in the category space";
			error = 1;
		}
		if ($body.length === 0) {
			errorObj['body'] = "You must have something in the body";
			error = 1;
		}
		if ($tags.split(',').length > 3) {
			errorObj['tags'] = "There can be no more than 3 tags per post";
			error = 1;
		}
		if (error === 1) {
			$titleAlert.text(errorObj['title']);
			$categoryAlert.text(errorObj['category']);
			$pictureAlert.text(errorObj['picture']);
			$bodyAlert.text(errorObj['body']);
			$tagAlert.text(errorObj['tags']);

		}
		else {
			$postForm.submit();
		}
	}

	$('#ajaxSubmit').on('click', function() {
		newpostAjaxCall();
	})
})