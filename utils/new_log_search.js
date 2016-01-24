'use strict';
var fs = require('fs');
var time_stamp = require('./time_stamp_regex');
var _ = require('lodash');


function search__double_highlight(param, filename, callback) {
    var indicies_of_highlighted_text = {},
        time_stamp_value = {},
        highlighted_index = {},
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

        Object.prototype.getKeyByValue = function (value) {
            for (var prop in this) {
                if (this.hasOwnProperty(prop)) {
                    if (this[prop] === value)
                        return prop;
                }
            }
        };
        var counter = 0;
        stream
            .on('data', function (data) {
                findOccurence(data, highlighted_text, next_highlighted_text, indicies_of_highlighted_text, num,counter);
                findOccurence(data, highlighted_text_2, next_highlighted_text, indicies_of_highlighted_text, num,counter);
                counter+=data.length;
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
                console.log("Merged objects ",merged_objects);
                for (var l = 0; l < keys_of_mergedObjects.length-1; l++) {

                    if (merged_objects[keys_of_mergedObjects[l]] === "first" && merged_objects[keys_of_mergedObjects[l+1]] === "second") {
                        value_at_indicies[keys_of_mergedObjects[l + 1]] = indicies_of_highlighted_text[highlighted_text_2].indexOf(parseInt(keys_of_mergedObjects[l + 1]));
                    }
                }
                console.log("Value at indices",value_at_indicies);
                Object.keys(value_at_indicies).forEach(function (key) {
                    final_num.push(num[value_at_indicies[key]]);
                });

                Object.keys(value_at_indicies).forEach(function (key) {
                    highlighted_index[parseInt(key)] = "highlighted";
                });

                Object.keys(time_stamp).forEach(function (key) {
                    time_stamp_value[time_stamp[key]] = "time";
                });
                //console.log("TIMESTAMP",time_stamp);

                var merge_key_value = _.merge(time_stamp_value, highlighted_index);
                console.log(merge_key_value);

                var keys_of_merged = Object.keys(merge_key_value);
                console.log("Keys of merged",keys_of_merged);
                for (var t = 0; t < keys_of_merged.length-1; t++) {
                    if (merge_key_value[keys_of_merged[t]] === 'time' && merge_key_value[keys_of_merged[t+1]] === "highlighted") {
                        final_data[time_stamp.getKeyByValue(parseInt(keys_of_merged[t]))] = num[value_at_indicies[keys_of_merged[t+1].toString()]];
                    }
                }

                console.log("Final data ",final_data);
                console.log("NUM",num,num.length);
                callback(final_data);


            });

    });
}

//function for generating regex
function findOccurence(data, highlighted_text, next_highlighted_text, indicies_of_highlighted_text, num,counter) {
    var chunk_of_data = data.toString('utf-8');
    var new_regex = [];
    var digit_group = '[+-]?\\d+(\\.\\d+)?';
    var flag = 0;
    //console.log(highlighted_text);
    //console.log(next_highlighted_text);

    if (highlighted_text === next_highlighted_text) {
        //console.log("COUNTER IS THE FUCK 2222",counter);
        for (var j = 0; j < highlighted_text.length; j++) {

            if(highlighted_text[j] === '.'){flag=0;}

            else if (highlighted_text[j] === ' ') {
                flag = 1;
                new_regex.push('\\s');
            }

            else if (highlighted_text[j] === '[' || highlighted_text[j] === ']' ||
                highlighted_text[j] === ':' || highlighted_text[j] === '/' || highlighted_text[j] === '(' ||
                highlighted_text[j] === ')' || highlighted_text[j] === ',') {

                flag = 1;
                new_regex.push('\\');
                new_regex.push(highlighted_text[j]);
            }

            else if (!isNaN(highlighted_text[j])) {

                if (flag === 1)
                    new_regex.push(digit_group);
                flag = 0;
            }

            else {
                new_regex.push(highlighted_text[j]);
            }
        }
    }
    else {

        for (var i = 0; i < highlighted_text.length; i++) {

            if (highlighted_text[i] === ' ') {
                new_regex.push('\\s');
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
    }

    //console.log(new_regex.join(""));

    var new_string = new_regex.join("");
    var regex = new RegExp(new_string, 'g');
    console.log("REGEX",regex);
    var result = findIndex(regex, chunk_of_data, highlighted_text, next_highlighted_text, num,counter);
    var keyword = result[0];
    var indices = result[1];

    if(!indicies_of_highlighted_text[keyword] || !(indicies_of_highlighted_text[keyword].length >= 0)) {
        //console.log("there", indicies_of_highlighted_text);
        indicies_of_highlighted_text[keyword] = [];
    }

    indicies_of_highlighted_text[keyword] = indicies_of_highlighted_text[keyword].concat(indices);
    console.log("Indices ", indicies_of_highlighted_text);
}

//function for searching using inverted index key map
function findIndex(regex, chunk_of_data, highlighted_text, next_highlighted_text, num,counter) {
        var indices = [];
        var match;
        //console.log("LENGTH",chunk_of_data.length);
        while ((match = regex.exec(chunk_of_data)) !== null) {
            if (highlighted_text === next_highlighted_text) {
                //console.log("NEXT", match[0], match.index);
                num.push((match[0].match(/[+-]?\d+(\.\d+)?/g)).slice(-1).pop());
            }
            //console.log("findIndex match.index ", match.index, " counter is", counter);
            indices.push(match.index + counter);
            //console.log("LENGTH",chunk_of_data.length);
            //console.log("HELLO",indices.length);
        }
        return [highlighted_text, indices];
}

module.exports = {
    logAnalyser: search__double_highlight
};