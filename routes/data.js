var express = require('express'),
    router = express.Router(),
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


   var old_path = "public/" + req.files.file.name,
       new_path = "public/"+ req.files.file.originalname;

    fs.rename(old_path, new_path, function (err) {
        if (err) {
            res.json({err: err});
        }
        else{
            res.json({msg:"uploaded"});
        }
    });

});


router.post('/', function (req, res, next) {

    dataService.logAnalyser(req.body,__dirname+"/../"+req.body.name, function (arr) {
        res.json({
            "data": arr
        });
    });
});

module.exports = router;