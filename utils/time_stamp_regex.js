"use strict";
var fs = require('fs');

//generic regex for timestamp
var find_index_of_metadata = function (highlightTimestamp, fileName, cb) {
    var indices = {};
    var new_indices = {};

    var stream = fs.createReadStream(fileName);
    var counter = 0;
    var reg = "";

    //generating regex dynamically
    for (var k = 0; k < highlightTimestamp.length; k++) {

        if (/^[a-z|A-Z]$/.test(highlightTimestamp[k]))reg += "\\w";
        else if (/^[0-9]$/.test(highlightTimestamp[k]))reg += "\\d";
        else if (highlightTimestamp[k] == ' ')reg += '\\s';
        else if (/^\W$/.test(highlightTimestamp[k]))reg += '\\W';
    }

    //regex is created
    var regex = new RegExp(reg, 'g');

    //
    stream.on('data', function (data) {
        var value = data.toString('utf-8');
        var i = 1;
        var match;
        while ((match = regex.exec(value)) !== null) {

            //ignoring the repetition of timestamp
            if (Object.keys(indices).indexOf(match[0].trim()) == -1)
                indices[match[0].trim()] = match.index + counter;
            i++;
        }
        counter += data.length;
    });

    stream.addListener('close', function () {
        Object.keys(indices).forEach(function (key) {
            new_indices[key + '_' + (Object.keys(indices).indexOf(key) + 1).toString()] = indices[key];
        });
        cb(indices);
    });

};

module.exports = {
    find_index_of_time: find_index_of_metadata
};