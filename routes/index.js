var express = require('express');
var router = express.Router();

var fetchValues = require('../utils/parser');

router.get('/', function (req, res) {
    fetchValues(res, function (data) {
      res.json(data);
    });
});

module.exports = router;