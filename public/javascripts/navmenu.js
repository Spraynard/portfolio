$(function() {
	$('.nav-item').on({
		mouseenter: function() {
			$(this).addClass("current");
			console.log("Hovering")
		},
		mouseleave: function() {
			$(this).removeClass("current");
			console.log("Leaving")
		}
	})

	$navWrap = $('#nav-wrapper');
	$button = $('#nav-button-mobile');
	// 	Toggling open state on the nav menu when
	//		you click the button. Also inserting 'close'
	//		text into the div.
	$('#nav-button-mobile').on('click', function() {
		$navWrap.toggleClass('open')
	})
})