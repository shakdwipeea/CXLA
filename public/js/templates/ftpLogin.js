/**
 * Created by akash on 17/1/16.
 */
(function (window) {
    /**
     * The login template
     * @constructor
     */
    function FTPLogin () {
       this.template = null;
    }

    /**
     * Initialize the ftpLogin view by getting the template
     * and compiling the handlebars
     */
    FTPLogin.prototype.initialize = function () {
        var self = this;
        superagent.get('/js/templates/ftpLogin.html')
            .end(function (err, res) {
                console.log("Error occured while retreiving", err);
                var source = res.text;
                self.template = Handlebars.compile(source);
            });
    };

    /**
     * Called to display the loginForm.
     * @return It returns the html which can be added to DOM
     */
    FTPLogin.prototype.show = function () {
        return this.template();
    };

    FTPLogin.prototype.getFormData = function () {
        return {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            host: document.getElementById('host').value,
            port: document.getElementById('port').value,
            source: document.getElementById('file-name').value
        }
    }


    /**
     * export the module
     * @type {{}}
     */
    window.app = window.app || {};
    window.app.FTPLogin = FTPLogin;
})(window);