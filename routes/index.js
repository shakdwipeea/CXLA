var express = require('express');
var router = express.Router();


router.get('/error', function (req, res){
    res.render("index");
});


router.get('/gui', function(req, res){
    res.render("gui");
});

module.exports = router;