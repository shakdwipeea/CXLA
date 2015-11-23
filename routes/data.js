var express = require('express'),
    router = express.Router(),
    fs = require('fs')
    dataService = require('../utils/log_search');


/*
router.get('/', function (req, res) {
    //console.log(__dirname);
    dataService.logAnalyser(__dirname + "/../utils/testFile.txt", function (arr) {
        res.json({
            "data": arr
        });
    });
});
*/


router.post('/upload', function (req,res,next) {

    console.log(req.body, req.file);
   var old_path = __dirname+"/../public/data/" + req.file.filename;
    console.log(old_path);
    var new_path = __dirname+"/../public/data/"+ req.file.originalname;
    console.log(new_path);

    fs.rename(old_path, new_path, function (err) {
        console.log("HI",err);
        if (err) {
            console.log(err);
            res.json({err: err});
        }
        else{
            console.log("HIfehf");
            res.json({msg:"uploaded"});
        }
    });

});


router.post('/', function (req, res, next) {

    dataService.logAnalyser(req.body,__dirname+"/../public/data/"+req.body.file_name, function (arr) {
        res.json({
            "data": arr
        });
    });
});

module.exports = router;