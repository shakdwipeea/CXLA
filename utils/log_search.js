'use strict';
var fs = require('fs');
var time_stam = require('./time_stamp_regex');
var _ = require('lodash');

function search_prototype_double_highlight(param, filename, callback) {
    var result = {};
    var attrib = {};
    var num = [];
    var h1 = {};
    var h2 = {};
    var final_num = [];
    var final_data = {};

    var highlighted_text = param[0];
    var highlighted_text_2 = param[1];
    //var h_1 = highlighted_text;
    var h_2 = highlighted_text_2;
    time_stam.find_index_of_time(filename, function (time_stam) {

        var stream = fs.createReadStream(filename);
        var start = new Date().getTime();

        stream
            .on('data', function (data) {
                findOccurence(data, highlighted_text, h_2,result,num);
                findOccurence(data, highlighted_text_2, h_2,result,num);
            })

            .addListener('close', function () {

                for(var i = 0;i< result[highlighted_text].length;i++){
                    h1[result[highlighted_text][i]] = "first";
                }
                for(var j = 0;j< result[highlighted_text_2].length;j++){
                    h2[result[highlighted_text_2][j]] = "second";
                }

                var h3 = _.merge(h1,h2);
                var arr = Object.keys(h3);

                for(var l = 0;l<arr.length-1;l++){

                    if(h3[arr[l]] === "first"){
                        attrib[arr[l+1]] =  result[highlighted_text_2].indexOf(parseInt(arr[l+1]));
                    }
                }

                Object.keys(attrib).forEach(function (key) {
                   final_num.push(num[attrib[key]]);
                });

                var k = 0;
                Object.keys(time_stam).forEach(function (key) {
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
function findOccurence(data, keyword, h,result,num) {
    var value = data.toString('utf-8');
    var new_regex = [];

    for (var i = 0; i < keyword.length; i++) {

        if (keyword[i] === ' '){
            new_regex.push('\s');}

        else if (keyword[i] === '.' || keyword[i] === '[' || keyword[i] === ']' ||
            keyword[i] === ':' || keyword[i] === '/' || keyword[i] === '(' ||
            keyword[i] === ')') {

            new_regex.push('\\');
            new_regex.push(keyword[i]);
        }

        else {

            new_regex.push(keyword[i]);

        }
    }

    //console.log(new_regex.join(""));

    var str = new_regex.join("");
    var hre = new RegExp(str, 'g');

    findIndex(hre, value, keyword, h,num, function (keyword, indices) {
        result[keyword] = indices;
    });

}

//function for searching using inverted index key map
function findIndex(pattern, value, keyword, h,num, cb) {
    process.nextTick(function () {
        var indices = [];
        //console.log(pattern.exec(value));
        var match;
        while ((match = pattern.exec(value)) !== null) {
            //console.log("match found at " + match.index);
            var matchAt = match.index;

            if (keyword === h) {

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