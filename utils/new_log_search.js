'use strict';
var fs = require('fs');
var time_stamp = require('./time_stamp_regex');
var _ = require('lodash');


function searchDoubleHighlight(highlightTimestamp,param, filename, callback) {
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
    time_stamp.find_index_of_time(highlightTimestamp,filename, function (time_stamp) {

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
                findOccurence(data, highlighted_text, next_highlighted_text, indicies_of_highlighted_text, num, counter);
                findOccurence(data, highlighted_text_2, next_highlighted_text, indicies_of_highlighted_text, num, counter);
                counter += data.length;
            })

            .addListener('close', function () {
                //console.log("IOFHT",indicies_of_highlighted_text);
                for (var i = 0; i < indicies_of_highlighted_text[highlighted_text].length; i++) {
                    highlighted_1[indicies_of_highlighted_text[highlighted_text][i]] = "first";
                }
                for (var j = 0; j < indicies_of_highlighted_text[highlighted_text_2].length; j++) {
                    highlighted_2[indicies_of_highlighted_text[highlighted_text_2][j]] = "second";
                }

                var merged_objects = _.merge(highlighted_1, highlighted_2);
                //console.log("Merged ",merged_objects);
                var keys_of_mergedObjects = Object.keys(merged_objects);
                //console.log("KEY",keys_of_mergedObjects);
                if(indicies_of_highlighted_text[highlighted_text][0] < indicies_of_highlighted_text[highlighted_text_2][0]) {
                    for (var l = 0; l < keys_of_mergedObjects.length - 1; l++) {

                        if (merged_objects[keys_of_mergedObjects[l]] === "first" && merged_objects[keys_of_mergedObjects[l + 1]] === "second") {
                            value_at_indicies[keys_of_mergedObjects[l + 1]] = indicies_of_highlighted_text[highlighted_text_2].indexOf(parseInt(keys_of_mergedObjects[l + 1]));
                        }
                    }
                } else {
                    for (var y = 0; y < keys_of_mergedObjects.length - 1; y++) {

                        if (merged_objects[keys_of_mergedObjects[y]] === "second" && merged_objects[keys_of_mergedObjects[y + 1]] === "first") {
                            value_at_indicies[keys_of_mergedObjects[y]] = indicies_of_highlighted_text[highlighted_text_2].indexOf(parseInt(keys_of_mergedObjects[y]));
                        }
                    }
                }
                //console.log("VAI",value_at_indicies);
                Object.keys(value_at_indicies).forEach(function (key) {
                    final_num.push(num[value_at_indicies[key]]);
                });

                Object.keys(value_at_indicies).forEach(function (key) {
                    highlighted_index[parseInt(key)] = "highlighted";
                });

                Object.keys(time_stamp).forEach(function (key) {
                    time_stamp_value[time_stamp[key]] = "time";
                });


                var merge_key_value = _.merge(time_stamp_value, highlighted_index);


                var keys_of_merged = Object.keys(merge_key_value);

                for (var t = 0; t < keys_of_merged.length - 1; t++) {
                    if (merge_key_value[keys_of_merged[t]] === 'time' && merge_key_value[keys_of_merged[t + 1]] === "highlighted") {
                        final_data[time_stamp.getKeyByValue(parseInt(keys_of_merged[t]))] = num[value_at_indicies[keys_of_merged[t + 1].toString()]];
                    }
                }

                if(final_data)
                callback(null,final_data);
                else
                callback("err",null);


            });

    });
}

//function for generating regex
function findOccurence(data, highlighted_text, next_highlighted_text, indicies_of_highlighted_text, num, counter) {
    var chunk_of_data = data.toString('utf-8');
    var new_regex = [];
    var digit_group = '(-)?\\d+(\\.\\d+)?';
    var flag = 0;


    if (highlighted_text === next_highlighted_text) {
        if (highlighted_text[0] === '.') {
        }

        else if (highlighted_text[0] === ' ') {
            //if(j==0)new_regex.push('\\s');
            new_regex.push('\\s');

        }

        else if (highlighted_text[0] === '[' || highlighted_text[0] === ']' ||
            highlighted_text[0] === ':' || highlighted_text[0] === '/' || highlighted_text[0] === '(' ||
            highlighted_text[0] === ')' || highlighted_text[0] === ',' || highlighted_text[0] === '-' || highlighted_text[0] === '_') {


            new_regex.push('\\');
            new_regex.push(highlighted_text[0]);
        }

        else if (!isNaN(highlighted_text[0])) {


            new_regex.push(digit_group);

        }

        else {
            new_regex.push(highlighted_text[0]);
        }
        for (var j = 1; j < highlighted_text.length; j++) {

            if (highlighted_text[j] === '.') {
                flag = 1;
            }

            else if (highlighted_text[j] === ' ') {

                if(flag == 1){
                    new_regex.push('\\s+');

                    flag = 0;}
            }

            else if (highlighted_text[j] === '[' || highlighted_text[j] === ']' ||
                highlighted_text[j] === ':' || highlighted_text[j] === '/' || highlighted_text[j] === '(' ||
                highlighted_text[j] === ')' || highlighted_text[j] === ',' || highlighted_text[j] === '-' || highlighted_text[j] === '_') {

                flag = 1;
                new_regex.push('\\');
                new_regex.push(highlighted_text[j]);
            }

            else if (/^\d+$/.test(highlighted_text[j]) && !/^\d+$/.test(highlighted_text[j-1])) {
                new_regex.push(digit_group);
                flag = 1;
 
            }
            else if (/^\d+$/.test(highlighted_text[j]) && /^\d+$/.test(highlighted_text[j-1])) {
                flag = 1;
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


    var new_string = new_regex.join("");
    //console.log(new_string);
    var regex = new RegExp(new_string, 'g');
    console.log("REGEX",regex);
    var result = findIndex(regex, chunk_of_data, highlighted_text, next_highlighted_text, num, counter);
    var keyword = result[0];
    var indices = result[1];

    if (!indicies_of_highlighted_text[keyword] || !(indicies_of_highlighted_text[keyword].length >= 0)) {
        indicies_of_highlighted_text[keyword] = [];
    }

    indicies_of_highlighted_text[keyword] = indicies_of_highlighted_text[keyword].concat(indices);

}

//function for searching using inverted index key map
function findIndex(regex, chunk_of_data, highlighted_text, next_highlighted_text, num, counter) {
    var indices = [];
    var match;
    while ((match = regex.exec(chunk_of_data)) !== null) {
        if (highlighted_text === next_highlighted_text) {

            num.push((match[0].match(/(-)?\d+(\.\d+)?/g)).slice(-1).pop());
        }

        indices.push(match.index + counter);

    }
    return [highlighted_text, indices];
}

module.exports = searchDoubleHighlight;
