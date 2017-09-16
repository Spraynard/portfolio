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
		view.body = document.getElementsByTagName('body')[0];
		view.modal = document.getElementById('main-modal')
		view.modalWrap = document.getElementById('modal-wrap');
		view.modalPictureWrap = view.modal.querySelector('#modal-picture-wrap')
		view.modalInfoWrap = view.modal.querySelector('#modal-info-wrap')
		view.modalInfoContent = view.modalInfoWrap.querySelector('#modal-info-content')

	},
	openModal : function () {
		view.modal.classList.add('active');
	},
	closeModal : function () {
		view.modal.classList.remove('active');
		view.modalWrap.removeAttribute('style')
	},
	modalPlacementReset : function() {
		let browserHeight = window.innerHeight;
		let modalHeight = view.modalWrap.clientHeight;
		console.log("Modal Height: ",modalHeight)
		if (browserHeight > 500) {
			let leftover = browserHeight - modalHeight;
			console.log("Leftover", leftover)
			let margins = leftover / 2;
			console.log("Margins", margins)
			view.modalWrap.style.marginTop = margins + 'px';
		}
	},
	getRelevantElems : function(parentElem) {
	/*	Summary: Returns only the relevant child elements that
					I need for functionality
		Input: `parentElem` - The Element that I am obtaining child elements off of
	*/
		var elemObj = {
			picture: parentElem.getElementsByClassName('picture')[0],
			confirm: parentElem.getElementsByClassName('confirm')[0],
			confirmButton: parentElem.getElementsByClassName('confirm')[0].getElementsByClassName('pic-info-confirm')[0],
		}
		return elemObj
	},
	insertPicTemplates : function() {
		// Summary: Injects `.single-pic-wrapper` <div> elements into the DOM. `.picture`, `.information`, and `.confirm` for each picture are children
		// Input: None
		// Returns: A Promise. Resolves with `pics`.

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
			<div class="confirm">\
				<input type="button" class="pic-info-confirm" value="Information">\
			</div>\
			<div class="pic-holder">\
				<img id="' + picObj.id + '" class="picture loader" src="/images/dev-test-loaders/ajax-loader.gif"/>\
				<div class="img-backdrop"></div>\
			</div>\
			</div>';
		}
	},
	renderAllImages : function(pics) {
		// Summary: renders all images
	    // Input: `pics` - A list of pictures gained from API call
	    // Returns: N/A
		for (var i = 0; i < pics.length; i++) {
			let pic = pics[i];
			let id = pic.id;
			let placeHolder = new Image();
			let imgElement = document.getElementById(id)
			let picHolder = imgElement.parentElement;

			placeHolder.onload = function() {
				imgElement.src = placeHolder.src;

				// Re configuring margins so pictures are in the middle
				// 	of the picHolders they are located in.
				let parentHeight = picHolder.clientHeight;
				let imgHeight = imgElement.clientHeight;

				if (parentHeight > imgHeight) {
					let diff = parentHeight - imgHeight;
					imgElement.style.marginTop = (diff / 2) + 'px';
				}

				imgElement.classList.remove('loader');
			}

			placeHolder.src = pic.image
		}
		view.addEventListeners()
	},
	renderModalImage : function(pictureSrc) {
	/*	Summary: Injects a selected image into the modal */
		var pictureWrap = view.modalPictureWrap
		var imageTemp = '<img src="' + pictureSrc + '">';
		pictureWrap.innerHTML = imageTemp
	},
	renderInfoWrap : function() {
	/*	Summary: Sets the height of the modal info wrapper
	 *				to be the same height as the image wrapper.
	*/

		var loaderTemp = '<img class="loader" src="/images/dev-test-loaders/ajax-loader.gif">'
		var picHeight = view.modalPictureWrap.clientHeight

		if (window.innerWidth > 992) {
			var picHeight = view.modalPictureWrap.clientHeight
			view.modalInfoWrap.style.height = picHeight + 'px'
		} else if (window.innerWidth <= 992) {
			var picWidth = view.modalPictureWrap.getElementsByTagName('img')[0].clientWidth
			view.modalInfoWrap.style.width = picWidth + 'px'
		}

		view.modalInfoContent.innerHTML = loaderTemp

	},
	renderModalInfo : function(textSrc) {
		var res = textSrc.res
		var title = (res.title === "") ? 'none' : res.title
		var description = (res.descriptionHtml === "") ? 'none' : res.descriptionHtml
		var taken = (res.taken === "") ? 'none' : res.taken
		var link = (res.url === "") ? 'none' : res.url

		var template = '<div class="content-block">\
							<div class="header-block">Title</div>\
								<div class="block-content"><p>' + title + '</p>\
						</div></div>\
						<div class="content-block">\
							<div class="header-block">Description</div>\
								<div class="block-content"><p>' + description + '</p>\
						</div></div>\
						<div class="content-block">\
							<div class="header-block">Taken</div>\
								<div class="block-content"><p>' + taken + '</p>\
						</div></div>\
						<div class="content-block">\
							<div class="header-block">Link</div>\
								<div class="block-content"><a href="' + link + '">' + link + '</a>\
						</div></div>'

		view.modalInfoContent.innerHTML = template
	},
	addConfirmButtonClickListener : function(elem, elemObj) {
		elemObj.confirmButton.addEventListener('click', function() {
			// On a click of a confirm button,
			// want to bring up the modal and then inject the picture/information.
			view.openModal();
			view.renderModalImage(elemObj.picture.src);
			view.renderInfoWrap()
			view.modalPlacementReset()
			controller.getInfo(elem)
		})
	},
	addHoverListeners : function(confirmElem, picElem, type) {
		for (var i = 0; i < type.length; i++) {
			if (type[i] === "mouseover") {
				confirmElem.addEventListener('mouseover', function () {
					this.classList.add("hovered")
					picElem.classList.add("hovered")
				})
			} else if (type[i] === "mouseleave") {
				confirmElem.addEventListener('mouseleave', function () {
					this.classList.remove("hovered")
					picElem.classList.remove("hovered")
				})
			}
		}
	},
	addEventListeners : function() {
		// Summary: Adds hover event listeners to `single-pic-wrapper` children.
		// 				There will be more listeners added as user explores functionality
		var elements = document.getElementsByClassName('single-pic-wrapper');
		var modalClose = document.getElementById('modal-close');

		/*	Going through all `single-pic-wrappers` and adding click listeners/hover listeners */
		for (var i = 0; i < elements.length; i++) {
			let elem = elements[i];
			let elemObj = view.getRelevantElems(elem)

			view.addHoverListeners(elemObj.confirm, elemObj.picture, ['mouseover', 'mouseleave']);
			view.addConfirmButtonClickListener(elem, elemObj)
		}

		modalClose.addEventListener('click', function() {
			view.body.classList.remove('noScroll')
			view.closeModal()
		})
	}
}
const controller = {
	init : function() {
		// This function initializes the the program. Very important.
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
		var id = element.id.split('-')[2];
		var requestObject = {'type' : 'id', 'id' : id}
		var responseObject = {'elem' : element, 'res' : null}
		var url = '/projects/dev_test/main-api-call'
		// Promise stream
		controller.ajaxCall('POST', url, JSON.stringify(requestObject), true, responseObject)
			.then(view.renderModalInfo)
				.then(null, console.error);
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
		// 
		const coords = controller.getCoordinates();
		const url = '/projects/dev_test/main-api-call';

		controller.ajaxCall('POST', url, JSON.stringify(coords), true, false)
			.then(model.cachePics)
				.then(view.insertPicTemplates)
					.then(view.renderAllImages)
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