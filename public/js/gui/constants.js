(function  (window) {
		/**
		 * Events that happen in the app
		 * @type {{FILE_CHANGED: string, TEXT_SELECTED: string, ALL_SELECTED: string}}
		 */
		var Events = {
			FILE_CHANGED: "fileChanged",
			TEXT_SELECTED: "textSelected",
			ALL_SELECTED: "allSelected",
			ENTER_PRESSED: "enterPressed",
			RESET: "resetData"
		};

		/**
		 * Templates that are present
		 * @type {{CHART: {name: string, template: (*|Chart)}}}
		 */
		var Templates = {
			CHART: {
				name: 'CHART',
				template: new app.Chart()
			}
		};

		/**
		 * export the modules
		 * @type {{}}
		 */
		window.app = window.app || {};
		window.app.Events = Events;
		window.app.Templates = Templates;
})(window);