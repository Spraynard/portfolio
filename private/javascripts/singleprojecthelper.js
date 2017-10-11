$(function() {
	// `singleprojecthelper.js` is going to hold all of the functionality for
	//		the carousel that will be available only when there are one or more pics
	// 		that were uploaded for projects.
	var carouselWidth= '550px';
	var leftPaddle = $(".carousel-left");
	var rightPaddle = $(".carousel-right");
	var images = document.getElementsByClassName('single-project-pic')
	var currentImage = images[0]
	var imageIndex = 0
	var intrans = false;

	// Literally fuck animations in the dick.
	leftPaddle.on('click', function() {
		// Bool to limit animation to only function when there
		// 	is no more transition of the img element.
		if (intrans) return;
		intrans = true

		var nextImage = null
		if ((imageIndex - 1) < 0) {
			imageIndex = images.length - 1
		}
		else {
			imageIndex = imageIndex - 1
		}
		var nextImage = images[imageIndex]
		nextImage.setAttribute('style', 'margin-left: 450px;')

		$(currentImage).animate({
			'margin-left': '-' + carouselWidth
		}, 500, function() {
			currentImage.removeAttribute('style')
			$(currentImage).toggleClass('current')
			$(nextImage).toggleClass('current')
			$(nextImage).animate({
				'margin-left': '0'
				}, 500, function() {
					nextImage.removeAttribute('style')
					currentImage = nextImage
					intrans = false
			})
		})
	})

	rightPaddle.on('click', function() {
		if (intrans) return;
		intrans = true

		var nextImage = null
		if ((imageIndex + 1) > images.length - 1) {
			imageIndex = 0
		}
		else {
			imageIndex = imageIndex + 1
		}
		var nextImage = images[imageIndex]
		nextImage.setAttribute('style', 'margin-left: -450px;')

		$(currentImage).animate({
			'margin-left': carouselWidth
		}, 500, function() {
			currentImage.removeAttribute('style')
			$(currentImage).toggleClass('current')
			$(nextImage).toggleClass('current')
			$(nextImage).animate({
				'margin-left': '0'
				}, 500, function() {
					nextImage.removeAttribute('style')
					currentImage = nextImage
					intrans = false
			})
		})
	})
})