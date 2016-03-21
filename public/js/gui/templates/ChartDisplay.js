/**
 * Created by akash on 17/1/16.
 */
(function (window) {
    /**
     * The chart template
     * @constructor
     */
    function Chart () {
       this.template = null;
    }

    /**
     * Initialize the chart view by getting the template
     * and compiling the handlebars
     */
    Chart.prototype.initialize = function () {
        var self = this;
        superagent.get('/js/gui/templates/chartDisplay.html')
            .end(function (err, res) {
                console.log("Error occured while retreiving", err);
               var source = res.text;
                self.template = Handlebars.compile(source);
            });
    };

    /**
     * Called to display the chart.
     * @return It returns the html which can be added to DOM
     */
    Chart.prototype.show = function (data) {
        var modifiedData = [];
        Object.keys(data[0]).forEach(function (key) {
            var tempArray = [];
            tempArray.push(key);
            for(var i=0;i<data.length;i++){
                tempArray.push(parseInt(data[i][key]));
            }
            modifiedData.push(tempArray);
        });
        var context = {};
        context["data"] = modifiedData;
        return template(context);
    };


    /**
     * export the module
     * @type {{}}
     */
    window.app = window.app || {};
    window.app.Chart = Chart;
})(window);