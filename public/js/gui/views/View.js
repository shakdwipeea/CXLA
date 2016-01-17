/**
 * Created by akash on 17/1/16.
 */
(function (window) {
    function View(template, Events, Templates) {
        /**
         * initializations
         */
        this.template = template;
        this.chartTemplate = null;

        this.Events = Events;
        this.Templates = Templates;
        console.log("The Templates object", Templates);

        /**
         * File Selection Elements
         * @type {Element} Dome Elements
         */
        this.$fileInput = document.getElementById('fileInput');
        this.$fileDisplayArea = document.getElementById('fileDisplayArea');
        this.$done = document.getElementById('done');
        this.$next = document.getElementById('next');
        this.$keywords = document.getElementById('keywords');

        /**
         * Chart elements
         * @type {Element}
         */
        this.$chart = document.getElementById('chart');
    }

    /**
     *
     * @param event Event for which handler is to be registered
     * @param handler Handler function to call, defined in {@link Controller.js}
     */
    View.prototype.bind = function  (event, handler) {
    	var self = this;

        if (event === self.Events.FILE_CHANGED) {
            self.$fileInput.addEventListener('change', function () {
                //retrieve the first selected file
                var file = self.$fileInput.files[0];
                handler(file);
            });
        }

        else if (event === self.Events.TEXT_SELECTED) {
            self.$next.addEventListener('click', function () {
                //get selected text from the window
                var text = window.getSelection().toString();
                handler(text);
            });
        }

        else if (event === self.Events.ALL_SELECTED) {
            self.$done.addEventListener('click', function () {
               handler();
            });
        }
    };

    /**
     * Displays the data in the file display area
     * @param data Data to be displayed
     */
    View.prototype.displayFileData = function (data) {
        this.$fileDisplayArea.innerHTML = data;
        this.template.initialize();
    };

    /**
     * Display all the keywords selected by the user
     * @param keywords Keywords selected by user
     */
    View.prototype.displayKeywords = function (keywords) {
       var keywordsSelectedHTML = this.template.show(keywords);
        this.$keywords.innerHTML = keywordsSelectedHTML;
    };

    /**
     * Function to display error if encountered
     * @param err The error that occured
     */
    View.prototype.displayError = function (err) {
      //todo
    };

    /**
     * It adds the chart DOM as obtained in the DOM of document
     * @param data The Chart obtained as String
     */
    View.prototype.displayChart = function (data) {
        var chart = this.chartTemplate.show(data);
        console.log(chart);
        this.$chart.innerHTML = chart;
    };

    /**
     * Initialize and set up the chart template for use.
     * This includes fecthing the module and registering it with the view
     */
    View.prototype.initializeChartTemplate = function () {
        // this add chartTemplate in the current view
        // which should be referred by this.chartTemplate
        this.chartTemplate = this.Templates.CHART.template;

        //initialize the template
        this.chartTemplate.initialize();
    };


    /**
     * export the module
     * @type {{}}
     */
    window.app = window.app || {};
    window.app.View = View;
})(window);