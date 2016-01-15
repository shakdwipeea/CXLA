var express = require('express'),
    router = express.Router(),
    fs = require('fs');
    dataService = require('../utils/log_search');
    _ = require('lodash');
    async = require('async');




router.post('/upload', function (req, res, next) {

    //console.log(req.body, req.file);
    var old_path = __dirname + "/../public/data/" + req.file.filename;
    console.log(old_path);
    var new_path = __dirname + "/../public/data/" + req.file.originalname;
    console.log(new_path);

    fs.rename(old_path, new_path, function (err) {
        if (err) {
            console.log(err);
            res.json({err: err});
        }
        else {
            res.json({msg: "uploaded"});
        }
    });

});

/*function getResults(result,f,cb){

    dataService.logAnalyser(result, __dirname + "/../public/data/" + f, function (arr) {
        console.log(arr);
        cb(err,arr);
    });

}*/


/*router.post('/', function (req, res, next) {

    var d = req.body.data;
    var f = req.body.file_name;

    var arr = _.chunk(d,2);
    for(var j= 0;j<arr.length;j++){

    }

});*/

module.exports = router;