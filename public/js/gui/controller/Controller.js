/**
 * Created by akash on 17/1/16.
 */
(function (window) {
    function Controller(model, view, Events) {
        var self = this;
        self.model = model;
        self.view = view;

        /**
         * bind handler for various events as required
         */

        /**
         * event handler when a file is selected
         */
        self.view.bind(Events.FILE_CHANGED, function (file) {
            self.readFile(file);
        });

        /**
         * event handler when single text is highlighted
         */
        self.view.bind(Events.TEXT_SELECTED, function (selectedText) {
            self.selectText(selectedText);
        });

        /**
         * event handler when all data is selected
         */
        self.view.bind(Events.ALL_SELECTED, function () {
            self.requestChart();
        });

        /**
         * event handler for search
         */
        self.view.bind(Events.ENTER_PRESSED, function (query) {
            self.searchLog(query);
        });

        /**
         * event handler for reset
         */
        self.view.bind(Events.RESET, function () {
            self.reset();
        });

        /**
         * event handler for selecting timestamp
         */
        self.view.bind(Events.TIMESTAMP_SELECTED, function (text) {
           self.storeTimeStampText(text);
        });

        /**
         * event handler for saving chart
         */
        self.view.bind(Events.SAVE_CHART, function () {
            self.view.saveCurrentChart();
        });

        self.view.bind(Events.SEARCH_STRING, function (query) {
            self.searchLog(query);
        });

        self.view.bind(Events.TRIGGER_INTRO, function () {
            self.view.triggerIntro();
        });

        // initialize the chart library
        // todo if chart library is not loaded when draw function
        // called
        self.view.initializeChartLibrary(function () {
           console.log("Chart Library initialized");
        });

        self.view.triggerIntro();
    }

    /**
     * Function to read the file after file is selected
     * @param file File selected by the user
     */
    Controller.prototype.readFile = function (file) {
        var self = this;

        //reset current state
        self.reset();

        self.model.readFile(file, function (event) {
            var readFileData = event.target.result.split('\n')
                .splice(0, 100)
                .join("<br />");

            self.view.displayFileData(readFileData);
        });
    };

    /**
     * Store the selected text and display updated list of selected
     * text to the user
     * @param selectedText Selected Text by the user
     */
    Controller.prototype.selectText = function (selectedText) {
        var self = this;
        self.model.storeSelectedText(selectedText, function (keywords) {
            self.view.displayKeywords(keywords);

            if (keywords.length % 2 === 0) {
                self.view.changeNextText("Select Entity");
                self.view.enablePlotCharts();
            } else {
                self.view.changeNextText("Select Value");
            }

            //self.view.resetSelection();

        });
    };

    /**
     * idk what is this
     * @param newView
     */
    Controller.prototype.setView = function (newView) {

    };

    /**
     * Request the model to get the result of the highlighted log
     * data.
     * Initialize the ChartTemplate to be ready to display the charts
     */
    Controller.prototype.requestChart = function () {
        var self = this;
        self.view.initializeChartTemplate();
        self.model.postSelectedText(function (err, data) {
           if (err) {
               // display error
               self.view.displayError(err);
           } else {
               // display chart
               self.view.drawBasic(data);
               self.view.enableSaveChart();
           }
        });
    };

    Controller.prototype.searchLog = function (query) {
        var self = this;
        self.model.searchLog(query, function (err, data) {
           if (err) {
               console.log('Error occurred', err);
               self.view.displayError(err);
           } else {
               //display chart
               self.view.drawListing(data);
               self.view.enableSaveChart();
           }
        });
    };

    /**
     * Delete keywords from model
     */
    Controller.prototype.reset = function () {
        var self = this;
        console.log('Trying to reset');
        self.model.resetKeywords(function () {
            self.view.resetView();
        });
    };

    /**
     * Save timestamp text
     * @param text timestamp text
     */
    Controller.prototype.storeTimeStampText = function (text) {
          this.model.storeTimeStampText(text);
          this.view.displayTimeStamp(text);
          this.view.enableNextButton();
          this.view.resetSelection();
    };

    /**
     * export the module
     * @type {{}}
     */
    window.app = window.app || {};
    window.app.Controller = Controller;
})(window);