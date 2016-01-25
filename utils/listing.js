var fs =require('fs');
var time_stamp = require('./time_stamp_regex');

function listingByTimestamp(filename,timestamp,cb){
    var result = {};

    time_stamp.find_index_of_time(filename, function (time_stamp) {
    var stream = fs.createReadStream(filename);
    var counter = 0;
        stream
            .on('data', function (data) {
            get_details_timestamp(data,time_stamp,timestamp,counter,result);
                counter+=data.length;
                })
            .addListener('close', function () {
                cb(result);
        });

    });
}

function get_details_timestamp(data,time_stamp,timestamp,counter,result){
    var chunk_of_data = data.toString('utf-8');
    var m = [];
    Object.keys(timestamp).forEach(function (keys) {
        m.push(keys);
    });
    result[time_stamp] = chunk_of_data.substring(timestamp[time_stamp]-counter,timestamp[m[m.indexOf(time_stamp)+ 1]]-counter);
}


module.exports = {
    listingByTimestamp:listingByTimestamp
};