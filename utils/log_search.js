'use strict';
var fs = require('fs');
var time_stamp = require('./time_stamp_regex');
var _ = require('lodash');


function search__double_highlight(param, filename, callback) {
    var indicies_of_highlighted _text = {},
        value_at_indicies = {},
        num = [],
        highlighted_1 = {},
        highlighted_2 = {},
        final_num = [],
        final_data = {},
        highlighted_text = param[0],
        highlighted_text_2 = param[1],
        next_highlighted_text = highlighted_text_2;
    time_stamp.find_index_of_time(filename, function (time_stamp) {

        var stream = fs.createReadStream(filename);
        var start = new Date().getTime();

        stream
            .on('data', function (data) {
                findOccurence(data, highlighted_text, next_highlighted_text, indicies_of_highlighted_text, num);
                findOccurence(data, highlighted_text_2, next_highlighted_text, indicies_of_highlighted_text, num);
            })

            .addListener('close', function () {

                for (var i = 0; i < indicies_of_highlighted_text[highlighted_text].length; i++) {
                    highlighted_1[indicies_of_highlighted_text[highlighted_text][i]] = "first";
                }
                for (var j = 0; j < indicies_of_highlighted_text[highlighted_text_2].length; j++) {
                    highlighted_2[indicies_of_highlighted_text[highlighted_text_2][j]] = "second";
                }

                var merged_objects = _.merge(highlighted_1, highlighted_2);
                var keys_of_mergedObjects = Object.keys(merged_objects);

                for (var l = 0; l < keys_of_mergedObjects.length - 1; l++) {

                    if (merged_objects[keys_of_mergedObjects[l]] === "first") {
                        value_at_indicies[keys_of_mergedObjects[l + 1]] = indicies_of_highlighted_text[highlighted_text_2].indexOf(parseInt(keys_of_mergedObjects[l + 1]));
                    }
                }

                Object.keys(value_at_indicies).forEach(function (key) {
                    final_num.push(num[value_at_indicies[key]]);
                });

                var k = 0;
                Object.keys(time_stamp).forEach(function (key) {
                    if (k % 2 === 0) {

                        final_data[key] = final_num[k / 2];
                    }
                    k++;
                });

                console.log(final_data);
                callback(final_data);
                var time_taken = new Date().getTime() - start;
                console.log('Time ', time_taken);


            });

    });
}

//function for generating regex
function findOccurence(data, highlighted_text, next_highlighted_text,indicies_of_highlighted_text,num) {
    var chunk_of_data = data.toString('utf-8');
    var new_regex = [];

    for (var i = 0; i < highlighted_text.length; i++) {

        if (highlighted_text[i] === ' ') {
            new_regex.push('\s');
        }

        else if (highlighted_text[i] === '.' || highlighted_text[i] === '[' || highlighted_text[i] === ']' ||
            highlighted_text[i] === ':' || highlighted_text[i] === '/' || highlighted_text[i] === '(' ||
            highlighted_text[i] === ')') {

            new_regex.push('\\');
            new_regex.push(highlighted_text[i]);
        }

        else {

            new_regex.push(highlighted_text[i]);

        }
    }

    //console.log(new_regex.join(""));

    var new_string = new_regex.join("");
    var regex = new RegExp(new_string, 'g');

    findIndex(regex, chunk_of_data, highlighted_text, next_highlighted_text, num, function (keyword, indices) {
        indicies_of_highlighted_text[keyword] = indices;
    });

}

//function for searching using inverted index key map
function findIndex(regex, chunk_of_data, highlighted_text, next_highlighted_text, num, cb) {
    process.nextTick(function () {
        var indices = [];
        var match;
        while ((match = regex.exec(chunk_of_data)) !== null) {
            //console.log("match found at " + match.index);
            var matchAt = match.index;

            if (highlighted_text === next_highlighted_text) {

                var temp_num = [];
                for (var i = matchAt; i < chunk_of_data.length - 1; i++) {

                    if (!isNaN(chunk_of_data[i]) && !isNaN(chunk_of_data[i + 1])) {

                        temp_num.push(chunk_of_data[i]);
                        temp_num.push(chunk_of_data[++i]);
                    }

                    else if (!isNaN(chunk_of_data[i])) {
                        temp_num.push(chunk_of_data[i]);
                    }

                    else if (temp_num.length > 0 && isNaN(chunk_of_data[i])) {

                        num.push(temp_num.join(""));
                        temp_num = [];
                        break;
                    }

                }
            }
            indices.push(match.index);
        }
        cb(highlighted_text, indices);
    });
}

module.exports = {
    logAnalyser: search__double_highlight
};