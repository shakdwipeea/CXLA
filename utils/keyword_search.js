var fs = require('fs');
var time_stamp = require('./time_stamp_regex');
var _ = require('lodash');

function searchKeyword(keywords,filename,callback){
    var searched_keyword = {};
    var time_stamp_value = [];
    var keyword_searched = {};
    var final_data ={};
    time_stamp.find_index_of_time(filename, function (time_stamp) {

        var  stream = fs.createReadStream(filename);
        Object.prototype.getKeyByValue = function( value ) {
            for( var prop in this ) {
                if( this.hasOwnProperty( prop ) ) {
                    if( this[ prop ] === value )
                        return prop;
                }
            }
        };
        stream
            .on('data', function (data) {
                find_indicies(data,keywords,searched_keyword);
            })

            .addListener('close', function () {
                //console.log(time_stamp);
                //console.log(searched_keyword);

                Object.keys(time_stamp).forEach(function (key) {
                   time_stamp_value.push(time_stamp[key]);
                });

                for(var t=0;t<time_stamp_value.length;t++){
                    final_data[time_stamp.getKeyByValue(time_stamp_value[t])]=0;
                }
                for(var i=0;i<time_stamp_value.length-1;i++){
                    for(var j=0;j<searched_keyword[keywords].length;j++){
                        if(searched_keyword[keywords][j]>time_stamp_value[i] && searched_keyword[keywords][j]<time_stamp_value[i+1]){
                            final_data[time_stamp.getKeyByValue(time_stamp_value[i])]++;
                        }
                    }
                }
                console.log(final_data);
                callback(final_data);
            });
    });
}

function find_indicies(data,keywords,searched_keyword){
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

    console.log(new_regex.join(""));

    var new_string = new_regex.join("");
    var regex = new RegExp(new_string, 'g');

    findIndex(regex, chunk_of_data, keywords, function (keyword, indices) {
        searched_keyword[keyword] = indices;
    });
}

function findIndex(regex,chunk_of_data,keywords,cb){

    process.nextTick(function () {
        var indices = [];
        var match;
        while ((match = regex.exec(chunk_of_data)) !== null) {
            //console.log("match found at " + match.index);
            var matchAt = match.index;
            indices.push(match.index);
        }
        cb(keywords, indices);
    });

}

module.exports = {
    searchKeyword:searchKeyword
};