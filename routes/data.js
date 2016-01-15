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


router.post('/', function (req, res, next) {

    var d = req.body.data;
    var f = req.body.file_name;
    console.log(d,f);
    var data = [];
    console.log(_.chunk(d,2));
    var arr = _.chunk(d,2);
    var k = 0, m=arr.length-1;
   for(var j=0;j< arr.length;j++){

       dataService.logAnalyser(arr[j], __dirname + "/../public/data/" + f, function (arr) {
           console.log(arr);
          // data[arr[j][0]]=arr;
           data.push(arr);
           console.log("ddd");
           k++;


           if (k == m) {
               console.log("okay");
               res.json({
                   data: data
               });
           }

       });

    }


});

module.exports = router;