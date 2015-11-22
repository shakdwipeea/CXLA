var fs = require('fs');
var time_stam = require('./time_stamp_regex');


//var highlighted_text = "S(100.100.12.10:80";
//var highlighted_text_2 = "RspTime(";

var result = {};
var arr = [];
var attrib = {};
var num = [];
var final_num = [];
var final_data = {};


/*
function search_prototype_single_highlight(filename,callback){
    time_stam.find_index_of_time(filename, function (time_stam) {

        var stream = fs.createReadStream(filename);

        stream.
            on('data', function () {
                findOccurence(data, highlighted_text);
            });


    });


}
*/


function search_prototype_double_highlight(param,filename, callback) {
    var highlighted_text = param.highlighted_text;
    var highlighted_text_2 = param.highlighted_text_2;
    time_stam.find_index_of_time(filename, function (time_stam) {
        //console.log(time_stam);

        var stream = fs.createReadStream(filename);
        var start = new Date().getTime();

        stream
            .on('data', function (data) {
                findOccurence(data, highlighted_text);
                findOccurence(data, highlighted_text_2);
            })

            .addListener('close', function () {

                for (var i = 0; i < result[highlighted_text].length; i++) {

                    for (var j = 0; j < result[highlighted_text_2].length; j++) {

                        if (result[highlighted_text_2][j] > result[highlighted_text][i]) {

                            attrib[result[highlighted_text_2][j]] = j;
                            i += 1;
                        }
                    }
                }
                for (var key in attrib) {

                    final_num.push(num[attrib[key]]);
                }

                k = 0;

                for (var key in time_stam) {

                    if (k % 2 == 0) {

                        final_data[key] = final_num[k / 2];
                    }
                    k++;

                }
                console.log(result[highlighted_text_2]);
                console.log(num);
                console.log("Result is ", result[highlighted_text_2].length, attrib, final_num, final_data);

                callback(final_data);
                var time_taken = new Date().getTime() - start;
                console.log('Time ', time_taken);

            });

    });
}

//function for generating regex
function findOccurence(data, keyword) {
    var value = data.toString('utf-8');
    var new_regex = [];

    for (var i = 0; i < keyword.length; i++) {

        if (keyword[i] == ' ')
            new_regex.push('\s');

        else if (keyword[i] == '.' || keyword[i] == '[' || keyword[i] == ']' ||
            keyword[i] == ':' || keyword[i] == '/' || keyword[i] == '(' ||
            keyword[i] == ')') {

            new_regex.push('\\');
            new_regex.push(keyword[i]);
        }

        else {

            new_regex.push(keyword[i]);

        }
    }

    console.log(new_regex.join(""));

    var str = new_regex.join("");
    var hre = new RegExp(str, 'g');

    findIndex(hre, value, keyword, function (keyword, indices) {
        result[keyword] = indices;
    });

}

//function for searching using inverted index key map
function findIndex(pattern, value, keyword, cb) {
    process.nextTick(function () {
        var indices = [];
        //console.log(pattern.exec(value));
        while ((match = pattern.exec(value)) != null) {
            //console.log("match found at " + match.index);
            var matchAt = match.index;

            if (keyword == highlighted_text_2) {

                var temp_num = [];
                for (var i = matchAt; i < value.length - 1; i++) {

                    if (!isNaN(value[i]) && !isNaN(value[i + 1])) {

                        temp_num.push(value[i]);
                        temp_num.push(value[++i]);
                    }

                    else if (!isNaN(value[i])) {
                        temp_num.push(value[i]);
                    }

                    else if (temp_num.length > 0 && isNaN(value[i])) {

                        num.push(temp_num.join(""));
                        temp_num = [];
                        break;
                    }

                }
            }
            indices.push(match.index);
        }
        cb(keyword, indices);
    });
}

module.exports = {
    logAnalyser: search_prototype_double_highlight
};