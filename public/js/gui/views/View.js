/*global google, window */
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

        this.ENTER_KEY = 13;

        /**
         * File Selection Elements
         * @type {Element} Dome Elements
         */
        this.$fileInput = document.getElementById('fileInput');
        this.$fileDisplayArea = document.getElementById('fileDisplayArea');
        this.$done = document.getElementById('done');
        this.$next = document.getElementById('next');
        this.$keywords = document.getElementById('keywords');
        this.$reset = document.getElementById('reset');

        /**
         * Chart elements
         * @type {Element}
         */
        this.$chart = document.getElementById('chart_div');

        /**
         * Search bar elements
         * @type {Element}
         */
        this.$searchBox = document.getElementById('searchQuery');
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

        else if (event === self.Events.ENTER_PRESSED) {
            self.$searchBox.addEventListener('keydown', function (e) {
                if (e.keyCode === self.ENTER_KEY) {
                    handler(self.$searchBox.value);
                }
            });
        }

        else if (event === self.Events.RESET) {
            self.$reset.addEventListener('click', function () {
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
     * Initializes the google charts library
     * @param callback Callback to call when library is loaded
     */
    View.prototype.initializeChartLibrary = function (callback) {
        google.charts.load('44', {packages: ['corechart', 'line']});
        google.charts.setOnLoadCallback(callback);
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


    View.prototype.drawBasic = function (data) {
        var modifiedData = [];
        //todo this in controller
        Object.keys(data[0]).forEach(function (key) {
            var tempArray = [];
            tempArray.push(key);
            for(var i=0;i<data.length;i++){
                if(data[i][key].indexOf('.') != -1)
                    tempArray.push(parseFloat(data[i][key]));
                else
                    tempArray.push(parseInt(data[i][key]));
            }
            modifiedData.push(tempArray);
        });

        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn("string","time");
        for(var i=0;i<data.length;i++){
            dataTable.addColumn("number", i.toString());
        }
        dataTable.addRows(modifiedData);

        //todo abstract
        var options = {
            hAxis: {
                title: 'Time'
            },
            vAxis: {
                title: ''
            },
            pointSize:5
        };

        var chart = new google.visualization.LineChart(this.$chart);
        chart.draw(dataTable, options);
    };

    View.prototype.drawListing = function (data) {
        var modifiedData = [];
        modifiedData.push(['time','count']);
        Object.keys(data).forEach(function (key) {
            var tempArray = [];
            tempArray.push(key);
            tempArray.push(data[key]);
            modifiedData.push(tempArray);
        });
        console.log("modified",modifiedData);
        var dataTable = new google.visualization.arrayToDataTable(modifiedData);

        var options = {
            title: 'Listings',
            hAxis: {title: 'time', minValue: 0, maxValue: 2},
            //vAxis: {title: 'count', minValue: 0, maxValue: 15},
            width:1200,
            legend: 'none'
        };

        var chart = new google.visualization.ScatterChart(this.$chart);
        console.log("chart object",chart);
        chart.draw(dataTable, options)
    };

    /**
     * Reset the table of keywords
     * and hide any charts if visible
     */
    View.prototype.resetView = function () {
        this.$keywords.innerHTML = "";
        this.$chart.innerHTML = "";
    };


    /**
     * export the module
     * @type {{}}
     */
    window.app = window.app || {};
    window.app.View = View;
})(window);