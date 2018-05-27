//	This file is being used to provide more robust select options
// 		while also providing more clarity and less code in `newproject.pug` file

$(function() {
	var model = {
		months: {
			'january': {
				'days' : 31
			},
			'february': {
				'days' : 29
			},
			'march': {
				'days': 31
			},
			'april': {
				'days': 30
			},
			'may': {
				'days': 31
			},
			'june': {
				'days': 30
			},
			'july': {
				'days': 31
			},
			'august': {
				'days': 31
			},
			'september': {
				'days': 30
			},
			'october': {
				'days': 31
			},
			'november': {
				'days': 30
			},
			'december': {
				'days': 31
			}
		}
	};

	var view = {
		init: function() {
			view.renderStart();
			view.renderStartDays();
			view.renderEnd();
			view.renderEndDays();
			// Initialize froala in the view
			tinyMCEPackage("#project-input-body");
		},
		renderStart: function() {
			// Function for rendering the options on the `start`
			// 	select tags.
			var projectStartMonth = $('#project-input-start-month');
			var htmlMonths = '';
			var projectStartYear = $('#project-input-start-year');
			var htmlYears = '';

			controller.getMonths().forEach(function(month) {
				var monthOption = controller.makeOption(controller.capFirst(month));
				htmlMonths += monthOption;
			})
			projectStartMonth.html(htmlMonths);

			for (var i = controller.getCurrentYear(); i < controller.getCurrentYear() + 10; i++) {
				htmlYears += controller.makeOption(i);
			}
			projectStartYear.html(htmlYears);

			view.renderStartDays();
		},
		renderStartDays: function() {
			// Function for rendering the amount of days that will be on
			// 	the day select tag, depending on whichever month is currently
			// 	active.
			var projectStartDay = $('#project-input-start-day');
			var htmlDays = '';
			var currentMonth = controller.getSelectedStartMonth();
			var dayAmt = controller.getDays(currentMonth);
			for (var i = 0; i < dayAmt; i++) {
				dayOption = controller.makeOption(i+1);
				htmlDays += dayOption;
			}
			projectStartDay.html(htmlDays);
			controller.addChangeListener('start');
		},

		renderEnd: function() {
			var projectEndMonth = $('#project-input-end-month');
			var htmlMonths = '';
			var projectEndYear = $('#project-input-end-year');
			var htmlYears ='';

			controller.getMonths().forEach(function(month) {
				var monthOption = controller.makeOption(controller.capFirst(month));
				htmlMonths += monthOption;
			});

			projectEndMonth.html(htmlMonths);

			for (var i = controller.getCurrentYear(); i < controller.getCurrentYear() + 10; i++) {
				htmlYears += controller.makeOption(i);
			}

			projectEndYear.html(htmlYears);

			view.renderEndDays();
		},
		renderEndDays: function() {
			var projectEndDay = $('#project-input-end-day');
			var htmlDays = '';
			var currentMonth = controller.getSelectedEndMonth();
			var dayAmt = controller.getDays(currentMonth);
			for (var i=0; i < dayAmt; i++) {
				dayOption = controller.makeOption(i+1);
				htmlDays += dayOption;
			}
			projectEndDay.html(htmlDays);
			controller.addChangeListener('end');
		}
	};

	var controller = {
		init: function() {
			view.init();
		},
		// Returns the month value that is selected.
		getSelectedEndMonth: function() {
			var month = $('#project-input-end-month').val();
			return month;
		},

		getSelectedStartMonth: function() {
			var month = $('#project-input-start-month').val();
			return month;
		},

		//	Returns the current year that is current
		getCurrentYear: function() {
			var currentYear = new Date().getFullYear();
			return currentYear;
		},
		// Returns the total amount of days for the input month
		getMonths: function() {
			return Object.keys(model.months);
		},
		getDays: function(month) {
			month = month.toLowerCase();
			return model.months[month].days;
		},
		// Capitalizes the first letter of a string
		capFirst: function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		},
		// Returns an 'OPTION' HTML element with
		//	text and value the inputted value
		makeOption: function(value) {
			var template = '<option value=%data%>%data%</option>';
			return template.replace(/%data%/g, value);
		},
		addChangeListener: function(area) {
			if (area === 'start') {
				$('#project-input-start-month').on('change', function() {
					view.renderStartDays();
				});
			}
			else {
				$('#project-input-end-month').on('change', function() {
					view.renderEndDays();
				});
			}
		}
	};
	controller.init();
});
