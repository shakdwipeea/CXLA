/**
 * Created by akash on 17/1/16.
 */
(function (window) {
    function Model() {
        this.keywords = [];
        this.fileName = "";
        this.timeStampSelectText = "";
    }

    /**
     * @callback readFileCallback
     * @param event This event contains data read by the filereader
     */

    /**
     *
     * @param file File selected by the user
     * @param {readFileCallback} callback
     */
    Model.prototype.readFile = function (file, callback) {
        var reader = new FileReader();
        reader.onload = callback;
        reader.readAsText(file);

        this.fileName = file.name;

        superagent
            .post('/data/upload')
            .attach('file', file, file.name)
            .end(function(err, res) {
                console.log(err);
                console.log(res);
            });
    };

    /**
     * Callback to apss all the keywords selected by user and display it
     * @callback storeSelectedTextCallback
     * @param keywords All Keywords selected by the user
     */

    /**
     * It stores the new text selected by user in the keywords array
     * @param selectedText Text selected by user
     * @param {storeSelectedTextCallback} callback
     */
    Model.prototype.storeSelectedText = function (selectedText, callback) {
        this.keywords.push(selectedText);
        console.log("Keywords updated", this.keywords);
        callback(this.keywords);
    };

    /**
     * Called after log data result is received
     * @callback postSelectedTextCallback
     * @param err Error occurred, if any
     * @param res Response received from serevr
     */

    /**
     * Post selected Text data to the server
     * @param {postSelectedTextCallback} callback
     */
    Model.prototype.postSelectedText = function (callback) {
        console.log("timeStampTet", this.timeStampSelectText);

        if (this.keywords.length % 2 == 0) {
            superagent
                .post('/data')
                .send({
                    file_name: this.fileName,
                    data: this.keywords,
                    timeStampText: this.timeStampSelectText
                })
                .end(function (err, res) {
                    console.log(err, res);
                    callback(err, res.body.data);
                });
        } else {
            callback("Could not complete request", null);
        }

    };

    /**
     * Call the api to search for log
     * @param query Query to search
     * @param callback Callback when search is done
     */
    Model.prototype.searchLog = function (query, callback) {
        superagent.post('/data/search')
            .send({
                file_name: this.fileName,
                keywords: query,
                timeStampText: this.timeStampSelectText
            })
            .end(function (err, res) {
                console.log(err, res);
                callback(err, res.body.data);
            });
    };

    /**
     * Reset button update the view
     * can also use sth like Dispatcher
     * @param callback
     */
    Model.prototype.resetKeywords = function (callback) {
        this.keywords = [];
        callback();
    };

    /**
     * Store timestamp for the current field
     * @param text Timestamp selected
     */
    Model.prototype.storeTimeStampText = function (text) {
        this.timeStampSelectText = text;
        console.log("Storing timestamp", text, this.timeStampSelectText);
    };


    /**
     * export the module
     * @type {{}}
     */
    window.app = window.app || {};
    window.app.Model = Model;
})(window);