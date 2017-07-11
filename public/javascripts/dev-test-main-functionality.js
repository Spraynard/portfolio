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
			console.log("putClassSelected `state`: " + state);
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
	animateInfoDiv : function(elemObj, state) {
		// Summary: This function controls all of the animations for the `.information` div that pops
		// 			out from under each picture. Will provide comments on each `state` possiility to explain what's going on
		// Input: `elemObj` - An object containing all of the elements that will be required for all the functionality that I am trying to achieve within this function
		//		  `state` - What state I want the div to be animated to. For example. `state === 'loading'` if I want to put `.information` in the
		//					loading position that I have animated up
		// Returns: Possible empty return if there is an animation currently going on or if for some reason I didn't input a `.single-pic-wrapper` element
		// 			in my code.
		if (view.getAnimState()) {
			return
		}

		var picture = elemObj.picture;
		var infoDiv = elemObj.infoDiv;
		var confirm = elemObj.confirm;
		var confirmButton = elemObj.confirmButton;

		var computedStyle = window.getComputedStyle(elemObj.infoDiv);
		var position = computedStyle.getPropertyValue('bottom');

		view.setAnimState(true);
		if (state === 'loading') {
			// When I click on a picture who's information hasn't been loaded yet, `.information` will first go in
			// 	loading state; not fully coming out from behind div, and showing a preloader.
			view.setButtonState(true)
			confirmButton.value = (confirmButton.value === 'Information') ? 'Close' : 'Information';
			infoDiv.style.display = 'block'
			var a = infoDiv.animate([{
				bottom : position
			},
			{
				bottom : '-100px'
			}], {
				duration: 500,
				easing: 'cubic-bezier(0.19, 1, 0.22, 1)'
			})
			a.onfinish = function () {
				view.setAnimState(false)
				infoDiv.style.bottom = '-100px';
			}
		} else if (state === 'loaded') {
			// On this state, `.information` will fully go out from under div.
			if (!view.getButtonState()) {
				confirmButton.value = (confirmButton.value === 'Information') ? 'Close' : 'Information';
			}
			if (infoDiv.style.display === 'none') {
				infoDiv.style.display = 'block'
			}
			var b = infoDiv.animate([{
				bottom : position
			},
			{
				bottom : '-200px'
			}], {
				duration: 500,
				easing: 'cubic-bezier(0.19, 1, 0.22, 1)'
			})
			b.onfinish = function() {
				infoDiv.style.bottom = '-200px';
				view.setAnimState(false);
			}
		} else if (state === 'hidden') {
			// This state hides `.information`
			confirmButton.value = (confirmButton.value === 'Information') ? 'Close' : 'Information';
			view.setButtonState(false);
			var c = infoDiv.animate([{
				bottom : position
			},
			{
				bottom: '10px'
			}], {
				duration: 500,
				easing: 'cubic-bezier(0.19, 1, 0.22, 1)'
			})
			infoDiv.style.bottom = '10px';
			c.onfinish = function() {
				infoDiv.style.display = 'none'
				view.putClassSelected(elemObj, 'remove');
				view.setAnimState(false);
			}
		} else {
			console.log("I don't know what to do")
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
						view.animateInfoDiv(elemObj, 'loading');

						controller.getInfo(elem);
					} 
					else {
						if (elemObj.infoDiv.classList.contains('loaded')) {
							view.animateInfoDiv(elemObj, 'hidden');
							elemObj.infoDiv.classList.remove('loaded');
							elemObj.infoDiv.classList.add('closed');
						} else if (elemObj.infoDiv.classList.contains('closed')) {
							view.putClassSelected(elemObj, 'add');		
							view.animateInfoDiv(elemObj, 'loaded');
							elemObj.infoDiv.classList.remove('closed');
							elemObj.infoDiv.classList.add('loaded');
						} else {
							console.log("Whoa there!");
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
		view.animateInfoDiv(elemObj, 'loaded');
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
			.then(null, console.log)
	},
	getInfo : function (element) {
		// Gets the information for the picture. Calls back to
		// 	the server and gets text returned, which will be rendered.
		// Example element id `pic-id-12345`
		var responseObject = {'elem' : element, 'res' : null}
		function makeRequest() {
			return new Promise( function( resolve, reject ) {
				var id = element.id.split('-')[2];
				var requestObject = {'type' : 'id', 'id' : id}
				req = new XMLHttpRequest();

				req.onreadystatechange = digestResponse;
				req.open('POST', '/dev_test/main-api-call', true)
				req.setRequestHeader('Content-Type', 'application/json')
				req.send(JSON.stringify(requestObject));

				function digestResponse() {
					if (req.readyState === XMLHttpRequest.DONE) {	
						if (req.status === 200) {
							responseObject.res = JSON.parse(req.responseText);
							resolve(responseObject);
						} else {
							reject("Problem with getting the information");
						}
					}
				}
			})
		}
		// Promise stream
		makeRequest()
			.then(view.renderTxtInfo)
			.then(null, console.error)
	},
	getLocation : function() {
		// Summary: Makes call to an external server to get the location of the
		// 			current user.
		// Input: N/A
		// Return: Promise Stream ---> req.responseText of the server.
		if (model.location) {
			return model.location
		} else {
			return new Promise( function( resolve, reject ) {
				req = new XMLHttpRequest();

				req.onreadystatechange = digestResponse;
				req.open('GET', 'https://freegeoip.net/json/', true);
				req.send();

				function digestResponse() {
					// When the request is fulfilled and is returned with a 200 `OK` status
					//	send responseText down the promise stream.
					if (req.readyState === XMLHttpRequest.DONE) {	
						if (req.status === 200) {
							var responseHeader = req.getResponseHeader('Content-Type');
							if (responseHeader === 'application/json') {
								resolve(req.responseText)
							} else {
								reject("We are getting " + responseHeader + " back from the server...");
							}
						} else {
							alert('there was a problem');
							reject('Problem with giving the location');
						}
					}
				}
			})
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

		function makeRequest() {
		// Makes a request to the Node server. Server responds back with a
		//		list of JSON objects that are then `promise-streamed` over
		// 		to the model. After that is resolved, we will render the pictures.
			return new Promise( function( resolve, reject ) {
				// Coords object will be passed to the server
				var coords = controller.getCoordinates();
				var url = '/dev_test/main-api-call';
				const req = new XMLHttpRequest();

				req.onreadystatechange = grabResponse;
				req.open('POST', url, true);
				req.setRequestHeader('Content-Type', 'application/json');
				req.send(JSON.stringify(coords));

				function grabResponse (){
					if (req.readyState === XMLHttpRequest.DONE) {
						if (req.status === 200) {
							resolve(req.responseText);
						} else {
							reject('Problem with API call')
						}
					}
				}
			})
		}
		makeRequest()
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