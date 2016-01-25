var fs = require('fs');
var readline = require('readline');
var stream = require('stream');

var instream = fs.createReadStream('/Users/raghavrastogi/Documents/CXLA/public/data/testFile23.txt');
var outstream = new stream;
var rl = readline.createInterface(instream, outstream);
var indices = {};
var new_indices = {};
rl.on('line', function(line) {
    var value = line.toString('utf-8');
    //var old_regex = /([A-Z]{1}[a-z]{2})\s([A-Z]{1}[a-z]{2})\s([0-9]{1,2})\s(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)\s([0-9]{4})/g;
    var regex = /([A-Z]{1}[a-z]{2})?\s?([A-Z]{1}[a-z]{2})?\s([0-9]{1,2})\s(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)\s?([0-9]{4})?/g;

    var i = 1;
    var match;
    while ((match = regex.exec(value)) !== null) {
        //console.log("MATCH",match.index);
        //console.log(match[0].trim());
        //console.log(Object.keys(indices));
        if(Object.keys(indices).indexOf(match[0].trim()) == -1)
            indices[match[0].trim()] = match.index;
        i++;
    }
});

rl.on('close', function() {
    console.log("TIMESTAMP",indices);
    Object.keys(indices).forEach(function (key) {
        new_indices[key+'_'+ (Object.keys(indices).indexOf(key)+1).toString()] = indices[key];
    });
    //console.log(new_indices);
});