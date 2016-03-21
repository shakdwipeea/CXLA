var fs = require('fs');
var time_stamp = require('./time_stamp_regex');
var _ = require('lodash');

function searchKeyword(highlightTimestamp, keywords, filename, callback) {
    var searched_keyword = {};
    var time_stamp_value = [];
    //  var keyword_searched = {};
    var final_data = {};
    var merge_object_1 = {};
    var merge_object_2 = {};
    time_stamp.find_index_of_time(highlightTimestamp, filename, function (time_stamp) {

        var stream = fs.createReadStream(filename);

        //function for retrieving key by value in object
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
                console.log("keywords", keywords);
                find_indicies(data, keywords, searched_keyword, counter);
                counter += data.length;
            })

            .addListener('close', function () {


                Object.keys(time_stamp).forEach(function (key) {
                    time_stamp_value.push(time_stamp[key]);
                });


                for (var t = 0; t < time_stamp_value.length; t++) {
                    final_data[time_stamp.getKeyByValue(time_stamp_value[t])] = 0;
                }
                //get keys from timestamp object
                var time_stamp_key = Object.keys(time_stamp);

                //timestamp object
                for (var j = 0; j < time_stamp_key.length; j++) {
                    merge_object_1[time_stamp[time_stamp_key[j]]] = "time";
                }

                //indices of searched keyword
                var keyword_indices_list = searched_keyword[keywords];

                //searched keyword object
                for (var k = 0; k < keyword_indices_list.length; k++) {
                    merge_object_2[keyword_indices_list[k]] = "searched";
                }

                //merging of above objects
                var merged_object = _.merge(merge_object_1, merge_object_2);
                //console.log(merged_object);

                //extracting keys of merged object
                var key_of_merged_object = Object.keys(merged_object);
                var lengthOfMerged = key_of_merged_object.length;

                var value_of_merged_object = [];
                var indicies_of_time = [];

                //storing values of merged objects
                for (var h = 0; h < key_of_merged_object.length; h++) {
                    value_of_merged_object.push(merged_object[key_of_merged_object[h]]);
                }

                //extracting and storing indices from time object
                for (var p = 0; p < value_of_merged_object.length; p++) {
                    if (value_of_merged_object[p] === "time")
                        indicies_of_time.push(p);
                }

                //storing the occurrences of searched keyword
                for (var a = 0; a < indicies_of_time.length - 1; a++) {
                    var keyOfMerged = parseInt(key_of_merged_object[indicies_of_time[a]]);
                    var getKey = time_stamp.getKeyByValue(keyOfMerged);
                    final_data[getKey] = indicies_of_time[a + 1] - indicies_of_time[a] - 1;
                }
                //for storing the occurrence of last timestamp
                var keyOfMergedLast = parseInt(key_of_merged_object[indicies_of_time[a]]);
                var getKeyLast = time_stamp.getKeyByValue(keyOfMergedLast);
                final_data[getKeyLast] = lengthOfMerged - indicies_of_time[indicies_of_time.length - 1] - 1;
                callback(final_data);
            });
    });
}

function find_indicies(data, keywords, searched_keyword, counter) {
    var chunk_of_data = data.toString('utf-8');
    var new_regex = [];

    for (var i = 0; i < keywords.length; i++) {

        if (keywords[i] === ' ') {
            new_regex.push('\\s');
        }

        else if (keywords[i] === '.' || keywords[i] === '[' || keywords[i] === ']' ||
            keywords[i] === ':' || keywords[i] === '/' || keywords[i] === '(' ||
            keywords[i] === ')') {

            new_regex.push('\\');
            new_regex.push(keywords[i]);
        }

        else {

            new_regex.push(keywords[i]);

        }
    }

    var new_string = new_regex.join("");
    var regex = new RegExp(new_string, 'g');
    var result = findIndex(regex, chunk_of_data, keywords, counter);
    var keyw = result[0];
    var indices = result[1];

    if (!searched_keyword[keyw] || !(searched_keyword[keyw].length >= 0)) {
        searched_keyword[keyw] = [];
    }

    searched_keyword[keyw] = searched_keyword[keyw].concat(indices);
}

function findIndex(regex, chunk_of_data, keywords, counter) {
    var indices = [];
    var match;
    while ((match = regex.exec(chunk_of_data)) !== null) {

        //var matchAt = match.index;
        indices.push(match.index + counter);
    }

    return [keywords, indices];

}

module.exports = searchKeyword;