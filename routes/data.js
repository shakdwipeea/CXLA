var express = require('express'),
    router = express.Router(),
    fs = require('fs');
dataService = require('../utils/new_log_search');
search_keyword = require('../utils/keyword_search');
listing = require('../utils/listing');
_ = require('lodash');
async = require('async');


router.post('/search', function (req, res, next) {
    var f = req.body.file_name;
    search_keyword.searchKeyword("current time is Fri Aug 28 08:45:08 2015",req.body.keywords, __dirname + "/../public/data/" + f, function (search_keyword) {
        res.json({data: search_keyword});
    });
});


router.post('/upload', function (req, res, next) {


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


/**
 *
 */
router.post('/', function (req, res, next) {

    var d = req.body.data;
    var f = req.body.file_name;
    var data = [];
    var arr = _.chunk(d, 2);
    var k = 0, m = arr.length;
    for (var j = 0; j < arr.length; j++) {

        dataService.logAnalyser("current time is Fri Aug 28 10:46:55 2015",arr[j], __dirname + "/../public/data/" + f, function (arr) {
            data.push(arr);
            k++;
            complete();
        });
    }
    function complete() {
        if (k == m) {
            res.json({
                data: data
            });
        }
    }


});

router.post('/listing', function (req, res, next) {

    var f = req.body.file_name;
    listing.listingByTimestamp(req.body.time_stamp, __dirname + "/../public/data/" + f, function (data) {
        res.json({data: data});
    });
});


module.exports = router;