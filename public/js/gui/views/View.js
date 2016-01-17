/**
 * Created by akash on 17/1/16.
 */
(function (window) {
    function View(template, Events) {
        this.template = template;
        this.Events = Events;

        this.$fileInput = document.getElementById('fileInput');
        this.$fileDisplayArea = document.getElementById('fileDisplayArea');
        this.$done = document.getElementById('done');
        this.$fileReader = document.getElementById('fileReader');
        this.$next = document.getElementById('next');
        this.$keywords = document.getElementById('keywords');
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

    window.app = window.app || {};
    window.app.View = View;
})(window);