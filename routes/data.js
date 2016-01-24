var express = require('express'),
    router = express.Router(),
    fs = require('fs');
    dataService = require('../utils/new_log_search');
    search_keyword = require('../utils/keyword_search');
    _ = require('lodash');
    async = require('async');


router.post('/search', function (req,res,next) {
    var f = req.body.file_name;
    console.log(req.body);
    search_keyword.searchKeyword(req.body.keywords,__dirname + "/../public/data/" + f,function (search_keyword) {
        console.log(search_keyword);
        res.json({data:search_keyword});
    });
});



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
    console.log("Chink is ",_.chunk(d,2));
    var arr = _.chunk(d,2);
    var k = 0, m=arr.length;
    console.log("m is ", m);
   for(var j=0;j< arr.length;j++){

       dataService.logAnalyser(arr[j], __dirname + "/../public/data/" + f, function (arr) {
           //console.log("res",arr);
          // data[arr[j][0]]=arr;
           data.push(arr);
           //console.log("ddd");
           k++;
           //console.log("K is", k);
           complete();
       });
    }
    function complete () {
         if (k == m) {
               console.log("okay");
               res.json({
                   data: data
               });
           }
    }


});



module.exports = router;