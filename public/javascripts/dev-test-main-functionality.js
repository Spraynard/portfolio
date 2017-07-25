var model = {
		init : function() {
			// Initializes a location of the user when the model is initialized
			model.location = null;
			model.pictures = null;
			model.lat = null;
			model.lng = null;
		},
		cachePics : function(picInfo) {
			return new Promise(function ( resolve, reject ) {
				if (picInfo) {
					model.pictures = JSON.parse(picInfo);
					resolve()
				} else {
					reject("There is no picture info given");
				}
			})
		}
	}
const view = {
	init : function() {
		view.animState = false;
		// false if info div not opened, true if it is.
		view.buttonState = false;
	},
	getButtonState : function () {
		// Summary 
		return view.buttonState;
	},
	setButtonState : function (bool) {
		view.buttonState = bool
	},
	getAnimState : function () {
		return view.animState;
	},
	setAnimState : function (bool) {
		view.animstate = bool
	},
	putClassSelected : function (elemObj, state) {
		// Summary: puts/removes `selected state` on `.picture`, '.infoDiv', and `.confirm`
		// input: `elemObj` - An Object of Elements
		// 		  `state` - only "remove" or "add" will cause this function to do either of those two operations
		// Returns: An empty return if state is not input correctly.
		if (state !== 'add' && state !== 'remove') {
			return
		} else if (state === 'add' ) {
			elemObj.picture.classList.add('selected');
			elemObj.confirm.classList.add('selected');
			elemObj.infoDiv.classList.add('selected');
		} else if (state === 'remove') {
			elemObj.picture.classList.remove('selected');
			elemObj.confirm.classList.remove('selected');
			elemObj.infoDiv.classList.remove('selected');			
		}
	},
	insertPicTemplates : function() {
		return new Promise ( function(resolve, reject)  {
			var picWrapper = document.getElementById('picture-wrapper');
			var pics = controller.getPictures();
			var injection = '';
			for (var i = 0; i < pics.length; i++) {
				injection += picTemplateInsert(pics[i]);
			}
			picWrapper.innerHTML = injection;
			resolve(pics);
		})
		// Thank you hoisting :)
		function picTemplateInsert(picObj) {
		// Summary: 
			return '<div id="pic-id-' + picObj.id + '" class="single-pic-wrapper">\
						<div class="pic-holder">\
							<div class="confirm">\
								<input type="button" class="pic-info-confirm" value="Information">\
							</div>\
							<img id="' + picObj.id + '" class="picture loader" src="/images/dev-test-loaders/ajax-loader.gif"/>\
							<div class="information"></div>\
						</div>\
					</div>';
		}
	},
	renderImages : function (pics) {
		// Summary: renders all images
	    // Input: `pics` - A list of pictures gained from API call
	    // Returns: N/A
		for (var i = 0; i < pics.length; i++) {
			(function(pic) {
				var placeHolder = new Image();
				var id = pic.id;
				var imgElement = document.getElementById(id)

				placeHolder.onload = function() {
					imgElement.src = placeHolder.src;
					imgElement.classList.remove('loader');
				}

				placeHolder.src = pic.image
			})(pics[i])
		}
		view.addHoverEventListeners()
	},
	applyInfoDivCSS : function(elemObj, state) {
		// Summary: This function adds all of the necessary css classes to infoDivs (and some others) to simulate animations.
		// Input: `elemObj` - An object containing all of the elements that will be required for all the functionality that I am trying to achieve within this function
		//		  `state` - What state I want the div to be animated to. For example. `state === 'loading'` if I want to put `.information` in the
		//					loading position that I have animated up
		// Returns: N/A

		var picture = elemObj.picture;
		var infoDiv = elemObj.infoDiv;
		var confirm = elemObj.confirm;
		var confirmButton = elemObj.confirmButton;

		view.setAnimState(true);
		if (state === 'loading') {
			// When I click on a picture who's information hasn't been loaded yet, `.information` will first go in
			// 	loading state; not fully coming out from behind div, and showing a preloader.
			view.setButtonState(true)
			confirmButton.value = (confirmButton.value === 'Information') ? 'Close' : 'Information';
			infoDiv.classList.add('loading');
		} else if (state === 'loaded') {
			// On this state, `.information` will fully go out from under div.
			if (!view.getButtonState()) {
				confirmButton.value = (confirmButton.value === 'Information') ? 'Close' : 'Information';
			}

			if (infoDiv.classList.contains('loading')) {
				infoDiv.classList.remove('loading');
			}
			infoDiv.classList.add('loaded');
		} else if (state === 'hidden') {
			// This state hides `.information`
			confirmButton.value = (confirmButton.value === 'Information') ? 'Close' : 'Information';
			view.setButtonState(false);
			if (infoDiv.classList.contains('loading')) {
				infoDiv.classList.remove('loading');
			}
			infoDiv.classList.remove('loaded')
			view.putClassSelected(elemObj, 'remove')
		}
		// Want to remove `.hovered` from confirm and picture after every time there is an animation going down.
		// 		Improves usability for mobile devices
		if (confirm.classList.contains('hovered')) {
			confirm.classList.remove('hovered');
			picture.classList.remove('hovered');
		}
	},
	addHoverEventListeners: function() {
		// Summary: Adds hover event listeners to `single-pic-wrapper` children.
		// 				There will be more listeners added as user explores functionality
		// Input: None
		// Returns: None
		var elements = document.getElementsByClassName('single-pic-wrapper');
		var count = 0;

		for (var i = 0; i < elements.length; i++) {
			(function(elem) {
				var elemObj = {
					parent: elem,
					picture: elem.getElementsByClassName('picture')[0],
					confirm: elem.getElementsByClassName('confirm')[0],
					confirmButton: elem.getElementsByClassName('confirm')[0].getElementsByClassName('pic-info-confirm')[0],
					infoDiv: elem.getElementsByClassName('information')[0]
				}
				// All the information for how the confirm button
				// 	controls the state of the information, and loads it.
				elemObj.confirmButton.addEventListener('click', function() {
					if (!elemObj.infoDiv.hasChildNodes()) {
						// State manipulation for UI, info divs can go over any other picture
						view.putClassSelected(elemObj, 'add');
						// want a preloader injection while the information is loading.
						var injection = '<img src="/images/dev-test-loaders/preloader_preloaders.net.gif">';
						elemObj.infoDiv.innerHTML = injection;
						view.applyInfoDivCSS(elemObj, 'loading');

						controller.getInfo(elem);
					} 
					else {
						if (elemObj.infoDiv.classList.contains('loaded')) {
							view.applyInfoDivCSS(elemObj, 'hidden');
							elemObj.infoDiv.classList.remove('loaded');
							elemObj.infoDiv.classList.add('closed');
						} else if (elemObj.infoDiv.classList.contains('closed')) {
							view.putClassSelected(elemObj, 'add');		
							view.applyInfoDivCSS(elemObj, 'loaded');
							elemObj.infoDiv.classList.remove('closed');
							elemObj.infoDiv.classList.add('loaded');
						}
					}
				})

				elemObj.confirm.addEventListener("mouseover", function () {
					elemObj.confirm.classList.add("hovered");
					elemObj.picture.classList.add("hovered");
				})

				elemObj.confirm.addEventListener("mouseleave", function (e) {
					elemObj.confirm.classList.remove("hovered");
					elemObj.picture.classList.remove("hovered");
				})
			})(elements[i]);
		}
	},
	renderTxtInfo : function(responseObject) {
		// Summary: Renders information text in `.information`.
		// Input: `responseObject` - An object in the form '{'elem': HTML_Element, 'res': Object}, with `res` being the response from
		// 			api call that is above the promise stream for this call.
		// Response: None
		var elemObj = {
			parent: responseObject.elem,
			infoDiv: responseObject.elem.getElementsByClassName('information')[0],
			picture: responseObject.elem.getElementsByClassName('picture')[0],
			confirm: responseObject.elem.getElementsByClassName('confirm')[0],
			confirmButton: responseObject.elem.getElementsByClassName('confirm')[0].getElementsByClassName('pic-info-confirm')[0]
		}
		view.applyInfoDivCSS(elemObj, 'loaded');
		elemObj.infoDiv.classList.add('loaded');

		var res = responseObject.res;
		var description = res.descriptionHtml;
		var title = res.title;
		var views = res.views;
		var taken = res.taken;

		var injection = '';
		injection += '<div class="title-div"><h4>' + title + '</h4></div>';
		injection += '<p class="text-info">';
		if (description.split('').length > 10) {
			injection += '<span class="pic-description">' + description + '</span>'
		}
		injection += '<br><br>'
		injection += '<span class="pic-taken">Taken: ' + taken + '</span>'
		injection += '</p>'

		elemObj.infoDiv.innerHTML = injection;
	}
}
const controller = {
	init : function() {
		Promise.resolve(model.init())
			.then(controller.getLocation)
			.then(controller.setLocation)
			.then(view.init)
			.then(controller.makeApiCall)
			.then(null, console.error)
	},
	getInfo : function (element) {
		// Gets the information for the picture. Calls back to
		// 	the server and gets text returned, which will be rendered.
		// Example element id `pic-id-12345`
		var id = element.id.split('-')[2];
		var requestObject = {'type' : 'id', 'id' : id}
		var responseObject = {'elem' : element, 'res' : null}
		var url = '/dev_test/main-api-call'
		// Promise stream
		controller.ajaxCall('POST', url, JSON.stringify(requestObject), true, responseObject)
		.then(view.renderTxtInfo)
		.then(null, console.error)
	},
	ajaxCall : function(method, url, data, jsonRequest, responseObject) {
		// `````fetch() is also an acceptable way to do these ajax calls, albeit a little less browser compatible.```
		// Summary: Performs a call to the Node.js backend to receive data based on the url and method. Used to drastically reduce amount of code.
		// Input: `method` - The method used to be called to the server (i.e. 'POST'/'GET')
		//		  `url` - String containing the URL that I want to hit, whether it be my node server or a 3rd party url
		// 		  `data` - Data that is to be sent ta server
		// 		  `jsonRequest` - Flag to note if I am sending JSON as data to the request. This is needed for setting correct requestHeaders
		// 		  `responseObject` - Object used internally by one of my functions in the code. Didn't want to waste more time refactoring that.
		// Returns: A promise that is resolved with the responseText of a successful Node.js backend call.
		return new Promise( function( resolve, reject ) {
			req = new XMLHttpRequest();

			req.onreadystatechange = digestResponse;
			req.open(method, url, true);
			if (jsonRequest) {
				req.setRequestHeader('Content-Type', 'application/json')
			}
			if (data) {
				req.send(data)
			} else {
				req.send()
			}
			function digestResponse() {
				// When the request is fulfilled and is returned with a 200 `OK` status
				//	send responseText down the promise stream.
				if (req.readyState === XMLHttpRequest.DONE) {	
					if (req.status === 200) {
						if (responseObject) {
							responseObject.res = JSON.parse(req.responseText)
							resolve(responseObject)
						} else {
							resolve(req.responseText)
						}
					} else {
						reject('Problem with getting data from' + url);
					}
				}
			}
		})
	},
	getLocation : function() {
		// Summary: Makes call to an external server to get the location of the
		// 			current user.
		// Input: N/A
		// Return: Promise Stream ---> req.responseText of the server.
		if (model.location) {
			return model.location
		} else {
			return controller.ajaxCall('GET', 'https://freegeoip.net/json/', null, false, false)
		}
	},
	setLocation : function(locationObj) {
		// Summary: Sets the current location of the user in the model
		// Input: `locationObj` - An Object in form '{'lat': #{lat}, 'lng': #{lng}}'
		// Returns: Promise Stream ---> A Resolve with a locationObj, or a reject with a string
		return new Promise( function( resolve, reject ) {
			if (!model.location || !model.lat || !model.lng) {
				model.location = JSON.parse(locationObj);
				model.lat = model.location.latitude
				model.lng = model.location.longitude
				resolve(locationObj)
			} 
			else {
				reject('There is no current `location` setting in the model')
			}
		})
	},
	getCoordinates : function() {
		// This function can only be used after the location has been set.
		// Returns: A list of the latitude and longitude of the current location
		// 				ex: [latitude, longitude]
		return {'type' : 'coords', 'lat' : model.lat, 'lng' : model.lng }
	},
	makeApiCall : function () {
		coords = controller.getCoordinates();
		url = '/dev_test/main-api-call'
		controller.ajaxCall('POST', url, JSON.stringify(coords), true, false)
		.then(model.cachePics)
		.then(view.insertPicTemplates)
		.then(view.renderImages)
		.then(null, console.error)
	},
	getPictures : function() {
		return model.pictures;
	}
}
window.onload = function() {
	// When window loads, go ahead and initialize everything.
	controller.init()
}