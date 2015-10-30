var express = require('express'),
	router = express.Router(),
	dataService = require('../utils/log_search');


router.get('/', function  (req, res) {
	dataService("/Users/raghavrastogi/Desktop/testFile.txt", function  (arr) {
		res.json({
			"data": arr
		});
	});
});

module.exports = router;