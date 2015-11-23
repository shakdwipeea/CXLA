var express = require('express');
var router = express.Router();

var fetchValues = require('../utils/parser');

router.get('/', function (req, res) {
    fetchValues.log(res, function (data) {
      res.json(data);
    });
});

router.get('/error', (req, res) => {
    res.render("index");
});

router.post('/', function (req,res) {
    //fetchValues.sea
});

router.get('/gui', (req, res) => {
    res.render("gui");
});

module.exports = router;