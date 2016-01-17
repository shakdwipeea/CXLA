(function  () {
	/**
	 *
	 * @param name
     */
	function CXLA(name) {
		this.events = app.Events;

        this.store = new app.Store(name);
		this.model = new app.Model(this.store);

		this.dashboard = new app.Dashboard();
		this.view = new app.View(this.dashboard, this.events);

		this.controller = new app.Controller(this.model, this.view, this.events);
	}

	var cxla = new CXLA("logAnalyser");

	function setView () {
		cxla.controller.setView(document.location.hash);
	}

    window.addEventListener('load', setView);
    window.addEventListener('hashChange', setView);
})();