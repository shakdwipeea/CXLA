/**
 * Created by akash on 17/1/16.
 */
(function (window) {
    function Dashboard() {
        this.source = null;
        this.defaultTemplate = null;
    }

    /**
     * Get the template from server and compile it
     */
    Dashboard.prototype.initialize = function () {
        var self = this;
        superagent
            .get('js/gui/templates/keywordDisplay.html')
            .end(function (err, res) {
                self.source = res.text;
                self.defaultTemplate = Handlebars.compile(self.source);
            });
    };

    /**
     * Returns the updated view in html with all the keywords included
     * @param keywords keywords array
     * @returns {*} the updated html
     */
    Dashboard.prototype.show = function (keywordsArray) {
        var template = this.defaultTemplate;

        var keywords = [];
        for(var i = 0; i < keywordsArray.length; i+=2) {
            var entry = {};
            entry.key = keywordsArray[i];
            entry.value = keywordsArray[i + 1];

            var nameNode = document.getElementById(keywords.length);
            entry.name = nameNode ? nameNode.value : "";

            keywords.push(entry);
        }
        var context = {};
        context.keywords = keywords;

        console.log("The final Context", context);
        return template(context);
    };

    /**
     * export the module
     * @type {{}}
     */
    window.app = window.app || {};
    window.app.Dashboard = Dashboard;
})(window);