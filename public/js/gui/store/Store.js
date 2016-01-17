/**
 * Created by akash on 17/1/16.
 */
(function (window) {
    function Store(name) {
        //callback = callback || function () {};
        this._dbName = name;

        var data = {};
    }

    window.app = window.app || {};
    window.app.Store = Store;
})(window);