/**
 * Created by akash on 17/1/16.
 */
(function (window) {
    function Model() {
        this.keywords = [];
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



    window.app = window.app || {};
    window.app.Model = Model;
})(window);