var express = require('express');
var router = express.Router();

var fetchValues = require('../utils/parser');

router.get('/', function (req, res) {
    fetchValues.log(res, function (data) {
      res.json(data);
    });
});

router.post('/', function (req,res) {

    fetchValues.sea
});



module.exports = router;