$(function(){
	// var additional = "Hello"

	// console.log("model length = " + Object.keys(model).length)
	// console.log(Object.keys(model))
	// for (var i = 0; i < Object.keys(model).length; i++) {
	// 	var key = Object.keys(model)[key]
	// 	var headerTemp = '<'
	// }

	// // The following functions are used to produce functionality
	// // 	for the front page carousel.

	// function transCurrent(image) {
	// 	// Toggles current status of the image and toggles in-transit status
	// 	$(image).toggleClass('trans')
	// 	$(image).toggleClass('current')
	// }

	// function slideNext(nextImage, transImage) {
	// 	$(nextImage).toggleClass('current')
	// 	$(nextImage).animate({
	// 		'margin-left': '0'
	// 	}, 4000, function() {
	// 		nextImage.removeAttribute('style')
	// 		currentImage = nextImage
	// 		toggleTrans(transImage);
	// 		intrans = false;
	// 	})
	// }

	// function toggleTrans(transImage) {
	// 	$(transImage).toggleClass('trans');
	// }

	// var imageArray = document.getElementsByClassName('masthead-pic')
	// var currentImage = imageArray[0]
	// var imageIndex = 0;
	// var intrans = false;

	// // Main function to set the interval at which the carousel
	// //	goes throuh pictures. Also, controls the function calls
	// // 	to have the pictures go through their rounds
	// window.setInterval(function() {
	// 	if (intrans) return;
	// 	intrans = true;

	// 	if ((imageIndex + 1) > imageArray.length - 1) {
	// 		imageIndex = 0
	// 	}
	// 	else {
	// 		imageIndex = imageIndex + 1
	// 	}

	// 	var nextImage = imageArray[imageIndex]
	// 	nextImage.setAttribute('style', 'margin-left: -3500px')
	// 	transCurrent(currentImage);
	// 	slideNext(nextImage, currentImage)
	// }, 5000);
})