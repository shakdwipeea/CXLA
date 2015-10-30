var fs = require('fs');
var readline = require('readline');
var stream = require('stream');



var find_index_of_metadata = function(fileName,cb){
	var indices = [];
	var stream = fs.createReadStream(fileName);
    var bound = [];
    stream.on('data', function (data) {
    	var value = data.toString('utf-8');
        var regex = /([A-Z]{1}[a-z]{2})\s([A-Z]{1}[a-z]{2})\s([0-9]{1,2})\s(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)\s([0-9]{4})/g;
        //var regex = /([A-Z]{1}[a-z]{2})?\s?([A-Z]{1}[a-z]{2})?\s?([0-9]{1,2})?\s(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)?\s([0-9]{4})?/;
        
    while ((match = regex.exec(value)) !== null) {
        indices.push(match.index);
    }
    	});

    stream.addListener('close', function () {
              //console.log(indices);
              cb(indices);
          });

}

module.exports = {
	find_index_of_time:find_index_of_metadata
};