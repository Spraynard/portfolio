$(function() {
	var commentToggle = $('#comment-toggle');
	var commentToggleText = commentToggle.text()
	var commentSave = $('#comment-save');
	var entryWrapper = $('#comment-entry-wrapper');
	var entriesWrapper = $('#comment-entries-wrapper');
	var nameInput = $('#comment-input-name');
	var bodyInput = $('#comment-input-body');
	var state = false;

	function toggleCommentState() {
		state = state ? false : true;
		$(this).text( state ? "Close" : commentToggleText )
		entryWrapper.toggle();
	}

	function getTimestamp(dateObj) {
		var monthNames = ['January', 'February', 'March', 'April',
							'May', 'June', 'July', 'August', 'September',
							'October', 'November', 'December']

		var day = dateObj.getDate();
		var month = dateObj.getMonth();
		var year = dateObj.getUTCFullYear();

		var dateString = monthNames[month] + ' ' +  day + ', ' + year;
		return dateString;
	}

	function insertComment(comment) {
		var injection = '<div class="background-wrapper"><div class="comment-entry">';
		var authorTemp = '<div class="comment-author">%data%</div>'
		var dateTemp = '<div class="comment-date">%data%</div>'
		var bodyTemp = '<div class="comment-body">%data%</div>'
		var endDiv = '</div>'
		var hr = '<hr>'


		var author = authorTemp.replace('%data%', comment.name)
		var body = bodyTemp.replace('%data%', comment.body)
		var date = dateTemp.replace('%data%', getTimestamp(new Date()))

		injection += author + date + body + endDiv + endDiv + hr
		entriesWrapper.prepend(injection);
	}

	function saveComment() {
		var data = {
			name: nameInput.val(),
			body: bodyInput.val()
		}

		$.post('/blog/comments', data, function(returned) {
			if (returned) {
				insertComment(data)
				nameInput.val('')
				bodyInput.val('')
			}
		})
	}

	commentToggle.on('click', function() {
		toggleCommentState()
	})

	commentSave.on('click', function() {
		if (confirm('Post This Comment?')) {
			saveComment()

			if (entriesWrapper.hasClass('hidden')) {
				$('.hidden').toggleClass('hidden')
			}
		}
		else {
			return
		}
	})
})