(function  () {
	/**
	 *
	 * @param name App Name
     */
	function CXLA(name) {
		/**
		 * Log the app to console
		 */
		this.appName = name;
		console.log("The app is", this.appName);

		/**
		 * All the events that happen in the app
		 */
		this.events = app.Events;

		/**
		 * The data storage model
		 * @type {*|Model}
         */
		this.model = new app.Model();

		/**
		 * the first view
		 * @type {*|Dashboard}
         */
		this.dashboard = new app.Dashboard();

		/**
		 * The view ehich can render multiple templates
		 * @type {*|View}
         */
		this.view = new app.View(this.dashboard, this.events, app.Templates);

		/**
		 * Controller of the app
		 * @type {*|Controller}
         */
		this.controller = new app.Controller(this.model, this.view, this.events);
	}

	/**
	 * initialize the app
	 * @type {CXLA}
     */
	var cxla = new CXLA("logAnalyser");

	function setView () {
		cxla.controller.setView(document.location.hash);
	}

    window.addEventListener('load', setView);
    window.addEventListener('hashChange', setView);
})();