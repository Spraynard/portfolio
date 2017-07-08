$(function() {
	var buttonState = false;
	$('.nav-item').on({
		mouseenter: function() {
			$(this).addClass("current");
		},
		mouseleave: function() {
			$(this).removeClass("current");
		}
	})

	$navWrap = $('#nav-wrapper');
	$button = $('#nav-button-mobile');
	$navList = $('#nav-list');
	// 	Toggling open state on the nav menu when
	//		you click the button. Also inserting 'close'
	//		text into the div.
	$('#nav-button-mobile').on('click', function() {
		buttonState = buttonState ? false : true
		$navList.toggleClass('closed')
		$navList.toggleClass('open')
		$(this).toggleClass('active')
	})
})