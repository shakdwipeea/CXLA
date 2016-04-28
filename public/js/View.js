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
        this.ftpLoginTemplate = null;

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


        this.$selectTimestamp = document.getElementById('timestamp-select');
        this.$saveChart = document.getElementById('save-chart');

        this.$selectTimeStampDisplay =  document.getElementById('timestamp-text-display');

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

        this.$savedChartsContainer = document.getElementById('saved-charts-container');
        this.$savedCharts = document.getElementById('saved-charts');

        this.$go = document.getElementById('go');
        this.$help = document.getElementById('help');

        this.$ftp = document.getElementById('ftp-file-login');

        this.$entityQuery = document.getElementById('entity-query');
        this.$serachNext = document.getElementById('search-next')

        this.initializeDashboard();
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

        else if (event === self.Events.TIMESTAMP_SELECTED) {
            self.$selectTimestamp.addEventListener('click', function () {
                var text = window.getSelection().toString();
                handler(text);
            });
        }

        else if (event === self.Events.SAVE_CHART) {
            self.$saveChart.addEventListener('click', function () {
                handler();
            });
        }

        else if (event === self.Events.SEARCH_STRING) {
            self.$go.addEventListener('click', function () {
                handler(self.$searchBox.value);
            });
        }

        else if (event === self.Events.TRIGGER_INTRO) {
            self.$help.addEventListener('click', function () {
                handler();
            });
        }

        else if (event === self.Events.FTP_TRANSFER_REQUEST) {
            self.$ftp.addEventListener('click', function () {
                handler();
            });
        }

        else if (event === self.Events.SEARCH_ENTITY) {
            self.$entityQuery.addEventListener('keydown', function (e) {
                if (e.keyCode === self.ENTER_KEY) {
                    handler(self.$entityQuery.value);
                }
            })
        }
        else if (event === self.Events.SEARCH_NEXT) {
            self.$serachNext.addEventListener('click', function () {
                handler();
            })
        }
    };

    /**
     * Displays the data in the file display area
     * @param data Data to be displayed
     */
    View.prototype.displayFileData = function (data) {

        this.$fileDisplayArea.innerHTML = data;
        this.template.initialize();

        changeVisiblity(this.$selectTimestamp, true);
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

    /**
     * Initialize and set up ftplogin temp-late
     *
     */
    View.prototype.initializeFTPLoginTemplate = function () {
        this.ftpLoginTemplate = this.Templates.FTP_LOGIN.template;

        this.ftpLoginTemplate.initialize();
    }


    View.prototype.drawBasic = function (data) {
        console.log('data is', data);

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

        console.log("Modified data is ", modifiedData)

        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn("string","time");
        console.log("DATA",data);
        for(var i=0;i<data.length;i++){
            dataTable.addColumn("number", document.getElementById(i).value);
        }
        dataTable.addRows(modifiedData);

        var yLabel = "";

        for (var i = 0; i < data.length; i++) {
            yLabel += document.getElementById(i).value + "-";
        }
        yLabel = yLabel.substring(0, yLabel.length-1);


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
        this.$selectTimeStampDisplay.innerHTML = "";

        this.initializeDashboard();
        changeVisiblity(this.$selectTimestamp, true);
    };

    View.prototype.saveCurrentChart = function () {
        var HTMLForChart = this.$chart.innerHTML;

        var savedChartDiv = document.createElement('div');
        savedChartDiv.innerHTML = HTMLForChart;

        this.$savedChartsContainer.insertBefore(savedChartDiv, this.$savedCharts);
        //this.$savedCharts.innerHTML = "Ctrl + P to print charts";

        // clear current chart
        this.$chart.innerHTML = "";

    };

    // Get the ftp login template  html
    View.prototype.getFTPLoginTemplate = function () {
        return this.ftpLoginTemplate.show();       
    };

    // Get ftp credentials as entered in the form
    View.prototype.getFTPCredentials = function () {
        return this.ftpLoginTemplate.getFormData();
    }

    /**
     *
     * @param domElement Element in consideration
     * @param show Boolean Make visible or not
     */
    function changeVisiblity (domElement, show) {

        if (show) {
            domElement.removeAttribute("disabled");
        } else {
            domElement.setAttribute("disabled", "disabled");
        }

    };

    View.prototype.initializeDashboard = function () {
        changeVisiblity(this.$selectTimestamp, false);
        changeVisiblity(this.$done, false);
        changeVisiblity(this.$saveChart, false);
        changeVisiblity(this.$next, false);
        changeVisiblity(this.$go, false);


        // prefetch ftp login template
        this.initializeFTPLoginTemplate();
    };

    View.prototype.displayTimeStamp = function (text) {
        this.$selectTimeStampDisplay.innerHTML = text;
    };

    View.prototype.enableNextButton = function () {
        changeVisiblity(this.$next, true);
        changeVisiblity(this.$selectTimestamp, false);
        changeVisiblity(this.$go, true);
    };

    View.prototype.resetSelection = function () {
        window.getSelection().empty();
    };

    View.prototype.enablePlotCharts = function () {
          changeVisiblity(this.$done, true);
    };

    View.prototype.enableSaveChart = function () {
        changeVisiblity(this.$saveChart, true);
    };

    View.prototype.triggerIntro = function () {
        var intro = new introJs();
        intro.setOption('showProgress', true);
        intro.start();
    };

    View.prototype.changeNextText = function (text) {
        this.$next.innerHTML = text;
    };


    /**
     * export the module
     * @type {{}}
     */
    window.app = window.app || {};
    window.app.View = View;
})(window);