var elasticsearch = require('elasticsearch');
var time_stamp = require('./time_stamp_regex');
var fs = require('fs');

var client  = new elasticsearch.Client({
   host:"localhost:9200"
});

client.ping({
    requestTimeout: Infinity,
    hello: "elasticserach"
}, function (err) {

    if(err){
        console.log("err");
    }
    else{
        console.log("done");
    }
});

var new_index = {};
var time_indices = [];
time_stamp.find_index_of_time("testFile3.txt", function (time_stamp) {
   //console.log(time_stamp);
    for(key in time_stamp){
        time_indices.push(time_stamp[key]);
    }
    var stream = fs.createReadStream("testFile3.txt");
    stream.on('data', function (data) {
        for(var i = 0;i < time_indices.length - 1;i++){
                new_index[Object.keys(time_stamp)[i]] = data.toString().substring(time_indices[i],time_indices[i+1]);
            client.create({
                index: 'citrix_log',
                type: 'analysis',
                id: i+1,
                body: {
                    time_stamp:Object.keys(time_stamp)[i],
                    bod:new_index[Object.keys(time_stamp)[i]]
                }
            }, function (error, response) {
                console.log(error,response);
            });
        }
        new_index[Object.keys(time_stamp)[time_indices.length-1]] = data.toString().substr(time_indices[time_indices.length-1]);
    });

    stream.addListener('close', function () {
       console.log(new_index);



    });
});



client.search({
    index:"citrix",
    type:"log_cont",
    body:{
        query: {
            match : {
                body : "citrix.com1"
            }
        }
    }
}).then(function (resp) {
    //console.log(resp.hits.hits);
}, function (err) {
   console.log(err);
});